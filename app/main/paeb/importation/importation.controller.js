(function ()
{
    'use strict';

    angular
        .module('app.paeb.importation')
        .directive('customOnChangeimportation', function() {
          return {
            restrict: 'A',
            require:'ngModel',
            link: function (scope, element, attrs,ngModel) {
              var onChangeHandler = scope.$eval(attrs.customOnChangeimportation);
              element.bind('change', onChangeHandler);
              element.on("change", function(e) {
              var files = element[0].files;
              ngModel.$setViewValue(files);
            });
            }
          };
        })
        .service('fileUpload', ['$http', function ($http) {
          this.uploadFileToUrl = function(file, uploadUrl){
            var fd = new FormData();
            var rep='test';
            fd.append('file', file);
            $http.post(uploadUrl, fd,{
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(){
               console.log('tafa');
            }).error(function(){
               console.log('Rivotra');
            });
          }
        }])
        .controller('ImportationController', ImportationController);
    /** @ngInject */
    function ImportationController($mdDialog, $scope,apiUrl,$http,apiUrlexcel)
    {
        var vm = this;
        vm.affiche_load = false;

        $scope.uploadFile = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
        }
        vm.annulerfiltreimporter = function()
        {
          vm.fichier=null;
          $scope.uploadFile = null;
        };

        vm.importertest_region = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerregion/';
          var uploadUrl = apiUrl + "importer_region/testregion";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerregion/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_commune = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importercommune/';
          var uploadUrl = apiUrl + "importer_commune/testcommune";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importercommune/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_fokontany = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerfokontany/';
          var uploadUrl = apiUrl + "importer_fokontany/testfokontany";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerfokontany/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_district = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerdistrict/';
          var uploadUrl = apiUrl + "importer_district/testdistrict";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerdistrict/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_zap = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerzap/';
          var uploadUrl = apiUrl + "importer_zap/testzap";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerzap/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_zap_commune = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerzap_commune/';
          var uploadUrl = apiUrl + "importer_zap_commune/testzap_commune";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerzap_commune/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_cisco = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importercisco/';
          var uploadUrl = apiUrl + "importer_cisco/testcisco";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importercisco/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_ecole = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerecole/';
          var uploadUrl = apiUrl + "importer_ecole/testecole";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerecole/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_ecoleacces = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerecoleacces/';
          var uploadUrl = apiUrl + "importer_ecoleacces/testecoleacces";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerecoleacces/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_feffi = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerfeffi/';
          var uploadUrl = apiUrl + "importer_feffi/testfeffi";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerfeffi/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_conventionfeffi = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerconventionfeffi/';
          var uploadUrl = apiUrl + "importer_conventionfeffi/testconventionfeffi";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerconventionfeffi/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        
        vm.importertest_avenant_convention = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importeravenant_convention/';
          var uploadUrl = apiUrl + "importer_avenant_convention/testavenant_convention";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importeravenant_convention/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_passation_partenaire = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerpassation_partenaire/';
          var uploadUrl = apiUrl + "importer_passation_partenaire/testpassation_partenaire";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerpassation_partenaire/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.importertest_contrat_partenaire = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importercontrat_partenaire/';
          var uploadUrl = apiUrl + "importer_contrat_partenaire/testcontrat_partenaire";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importercontrat_partenaire/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        
        vm.importertest_passation_bureau_etude = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerpassation_bureau_etude/';
          var uploadUrl = apiUrl + "importer_passation_bureau_etude/testpassation_bureau_etude";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerpassation_bureau_etude/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        
        vm.importertest_contrat_bureau_etude = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importercontrat_bureau_etude/';
          var uploadUrl = apiUrl + "importer_contrat_bureau_etude/testcontrat_bureau_etude";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importercontrat_bureau_etude/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        
        vm.importertest_passation_prestataire = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importerpassation_prestataire/';
          var uploadUrl = apiUrl + "importer_passation_prestataire/testpassation_prestataire";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerpassation_prestataire/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        
        vm.importertest_contrat_prestataire = function (item,suppression) 
        {
          vm.affiche_load = true;
          var file =vm.myFile[0];
          var repertoire = 'importercontrat_prestataire/';
          var uploadUrl = apiUrl + "importer_contrat_prestataire/testcontrat_prestataire";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) 
          { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               vm.affiche_load = false;
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé erreur: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importercontrat_prestataire/"+data.nomFile;
                    vm.allimporation = data.zap_inserer;
                    console.log(vm.allzapp);
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
            vm.affiche_load = false;
          }
        }
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
      }
/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
