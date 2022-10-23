pipeline {
  agent any
    parameters {
      string(
         name: "Branch_Name", 
         defaultValue: 'develop', 
         description: '')
         string(
            name: "Image_Name", 
            defaultValue: 'website',
            description: '')
         string(
            name: "Image_Tag", 
            defaultValue: 'develop', 
            description: 'Image tag')
   
        booleanParam(
           name: "PushImage", 
           defaultValue: false)
    }
    stages {// stage blocks
        stage("Build docker images") {
          steps {
            script {
              echo "Bulding docker images"
              def buildArgs = """."""
              docker.build("${params.Image_Name}:${params.Image_Tag}", buildArgs)
            }
          }
        }

        stage("Push to Dockerhub") {
            //when {
            //equals expected: "true", actual: "${params.PushImage}" 
            //}
            steps {
              script {
                echo "Pushing the image to docker hub"
                def localImage = "${params.Image_Name}:${params.Image_Tag}"
                def repositoryName = "eamcorp/${localImage}"
            
                // Create a tag that going to push into DockerHub
                sh "docker tag ${localImage} ${repositoryName} "
                docker.withRegistry("", "dhub-rw-token") {
                  def image = docker.image("${repositoryName}");
                  image.push()
                }
            }
          }
        }

        stage("Delete builded image") {
          steps {
            script {
              def localImage = "${params.Image_Name}:${params.Image_Tag}"
              def repositoryName = "eamcorp/${localImage}"
              sh "docker image rmi ${localImage}"
              sh "docker image rmi ${repositoryName}"
            }
          }
        }

        stage("Deploy to website-dev VM") {
          steps {
            script {
              sh 'ssh -i /var/jenkins_home/keys/id_rsa user@35.202.0.202 "sudo docker stop test"'
              sh 'ssh -i /var/jenkins_home/keys/id_rsa user@35.202.0.202 "sudo docker rm test && sudo docker rmi eamcorp/website:develop"'
              sh 'ssh -i /var/jenkins_home/keys/id_rsa user@35.202.0.202 "sudo docker pull eamcorp/website:develop"'
              sh 'ssh -i /var/jenkins_home/keys/id_rsa user@35.202.0.202 "sudo docker run -d --name test -p 8080:3000 eamcorp/website:develop"'
            }
          }
        }
    }
}
