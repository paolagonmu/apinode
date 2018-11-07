pipeline { 
  agent any 
  tools {nodejs "node"}     
  stages 
  { 
        
stage ('Repositorio de  Git') { 
      steps { 
        git 'https://github.com/paolagonmu/apinode.git' 
      } 
    } 
    stage ('Instalar dependencias') { 
      steps { 
    bat 'npm install mocha'
      } 
    } 
     
    stage ('Test') { 
      steps { 
    bat 'npm test'
      } 
    }       
  } 
}