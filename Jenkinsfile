pipeline {
    agent any
    environment {
       GIT_REPO = 'MISW4403_202414_E04'
       GIT_CREDENTIAL_ID = '43771338-0057-4a96-ae03-93ee5419d871'
       SONARQUBE_URL = 'http://172.24.100.52:8082/sonar-misovirtual'
       SONAR_TOKEN = credentials('sonar-login')
    }
    stages {
       stage('Checkout') {
          steps {
             scmSkip(deleteBuild: true, skipPattern:'.*\\[ci-skip\\].*')
             git branch: 'main',
                credentialsId: env.GIT_CREDENTIAL_ID,
                url: 'https://github.com/MISW4403-Diseno-y-construccion-de-APIs/' + env.GIT_REPO
          }
       }
       stage('Build') {
          // Build app
          steps {
             script {
                docker.image('nodetools-isis2603:latest').inside('-u root') {
                   sh '''
                      npm i -s
                      nest build
                   '''
                }
             }
          }
       }
      stage('Test') {
          steps {
             script {
                docker.image('nodetools-isis2603:latest').inside('-u root') {
                   sh '''
                      npm run test:cov
                   '''
                }
             }
          }
       }
       stage('Static Analysis') {
          // Run static analysis
          steps {
             sh '''
                docker run --rm -u root -e SONAR_HOST_URL=${SONARQUBE_URL} -e SONAR_TOKEN=${SONAR_TOKEN} -v ${WORKSPACE}:/usr/src sonarsource/sonar-scanner-cli
             '''
          }
       }
    }
    post {
       always {
          // Clean workspace
          cleanWs deleteDirs: true
       }
    }
  }
