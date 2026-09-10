pipeline {
  agent any

  environment {
    SONAR_HOST_URL   = 'http://sonarqube:9000'
    SONAR_PROJECT_KEY = 'todoapp'
    BACKEND_IMAGE  = "todo-backend"
    FRONTEND_IMAGE = "todo-frontend"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Test - Backend') {
      steps {
        sh '''
          cd backend
          npm ci
          npm test
        '''
      }
    }



    stage('Sonar Scan') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh '''
            sonar-scanner \
              -Dsonar.projectKey="${SONAR_PROJECT_KEY}" \
              -Dsonar.sources=backend,frontend \
              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**
          '''
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build Images') {
      steps {
        sh '''
          set -e
          export BACKEND_TAG="${BUILD_NUMBER}"

          docker build -t ${BACKEND_IMAGE}:${BACKEND_TAG}  -t ${BACKEND_IMAGE}:latest  ./backend
        '''
      }
    }

    stage('Deploy (Local Docker Desktop)') {
      steps {
        sh '''
          set -e

          # backend
          docker rm -f ${BACKEND_IMAGE} || true
          docker run -d \
            --name ${BACKEND_IMAGE} \
            -p 3001:3001 \
            -e NODE_ENV=production \
            ${BACKEND_IMAGE}:latest

        '''
      } 
    }
  }
}
