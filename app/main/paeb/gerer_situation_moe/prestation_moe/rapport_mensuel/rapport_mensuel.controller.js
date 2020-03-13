(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.rapport_mensuel')
        .directive('customOnChange', function() {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChange);
          element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          ngModel.$setViewValue(files);
        })
        }
      };
    })
        .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;        
          element.bind('change', function(){
            scope.$apply(function(){
              //modelSetter(scope, element[0].files[0]);
               //console.log(element[0].files[0]);

            });
          });
        }
      };
    }])
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
    //.controller('DialogController', DialogController)
        .controller('Rapport_mensuelController', Rapport_mensuelController);
    /** @ngInject */
    function Rapport_mensuelController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemBureau_etude = {} ;
        vm.allbureau_etude = [] ;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;        

        vm.ajoutRapport_mensuel = ajoutRapport_mensuel;
        var NouvelItemRapport_mensuel=false;
        var currentItemRapport_mensuel;
        vm.selectedItemRapport_mensuel = {} ;
        vm.allrapport_mensuel = [] ;
        vm.showbuttonValidation = false;

        vm.selectedItemRapport_mensuel_valide = {} ;
        vm.allrapport_mensuel_valide = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;
        vm.myFile = [] ;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut bureau etude****************************************/
//col table
   /*     vm.bureau_etude_column = [
        {titre:"Nom"},
        {titre:"Nif"},
        {titre:"Stat"},
        {titre:"Siege"},
        {titre:"telephone"}
        ];

        //recuperation donnée prestataire
        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allbureau_etude = result.data.response;
        });

                //fonction selection item bureau etude
        vm.selectionBureau_etude = function (item)
        {
            vm.selectedItemBureau_etude = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemBureau_etude.id!=0)
            { 

              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratBybe','id_bureau_etude',item.id).then(function(result)
              {
                  vm.allcontrat_bureau_etude = result.data.response; 
                  console.log(vm.allcontrat_bureau_etude);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemBureau_etude', function()
        {
             if (!vm.allbureau_etude) return;
             vm.allbureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBureau_etude.$selected = true;
        });*/
 
/**********************************fin bureau etude****************************************/ 

/**********************************contrat prestataire****************************************/
/*
       vm.contrat_bureau_etude_column = [
        {titre:"Bureau d'etude"
        },
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        }];
       
         //fonction selection item contrat
        vm.selectionContrat_bureau_etude= function (item)
        {
            vm.selectedItemContrat_bureau_etude = item;

           if(item.id!=0)
           {
            vm.stepTwo = true;
            vm.stepThree = false;
            apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
            {
                  vm.allrapport_mensuel = result.data.response;
                  
            });

             apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',item.id,'validation',1).then(function(result)
            {
                vm.allrapport_mensuel_valide = result.data.response;                
                  
            });
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_bureau_etude', function()
        {
             if (!vm.allcontrat_bureau_etude) return;
             vm.allcontrat_bureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_bureau_etude.$selected = true;
        }); */       

/**********************************fin contrat prestataire****************************************/


/**********************************fin justificatif attachement****************************************/
      apiFactory.getAll("contrat_be/index").then(function(result)
      {
          vm.allcontrat_bureau_etude = result.data.response; 
          console.log(vm.allcontrat_bureau_etude);
      });

      apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportByvalidation','validation',0).then(function(result)
      {
        vm.allrapport_mensuel = result.data.response;
        
        if (vm.allrapport_mensuel.length>0)
        {
            vm.showbuttonNouvAppel = false;
        }
                  
      });
      apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportByvalidation','validation',1).then(function(result)
      {
        vm.allappel_offre_valide = result.data.response;
                  
      });

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemRapport_mensuel.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemRapport_mensuel.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterRapport_mensuel = function ()
        { 
          
          if (NouvelItemRapport_mensuel == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: '',
              date_livraison: '',
              observation: '',
              id_contrat_bureau_etude: ''
            };
        
            vm.allrapport_mensuel.push(items);
            vm.allrapport_mensuel.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRapport_mensuel = mem;
              }
            });

            NouvelItemRapport_mensuel = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport_mensuel','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutRapport_mensuel(rapport_mensuel,suppression)
        {
            if (NouvelItemRapport_mensuel==false)
            {
                test_existanceRapport_mensuel (rapport_mensuel,suppression); 
            } 
            else
            {
                insert_in_baseRapport_mensuel(rapport_mensuel,suppression);
            }
        }

        //fonction de bouton d'annulation rapport_mensuel
        vm.annulerRapport_mensuel = function(item)
        {
          if (NouvelItemRapport_mensuel == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemRapport_mensuel.description ;
            item.fichier   = currentItemRapport_mensuel.fichier ;
            item.date_livraison   = currentItemRapport_mensuel.date_livraison ;
            item.observation   = currentItemRapport_mensuel.observation ;
            item.id_contrat_bureau_etude   = currentItemRapport_mensuel.id_contrat_bureau_etude ;
          }else
          {
            vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRapport_mensuel.id;
            });
          }

          vm.selectedItemRapport_mensuel = {} ;
          NouvelItemRapport_mensuel      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRapport_mensuel= function (item)
        {
            vm.selectedItemRapport_mensuel = item;
            vm.nouvelItemRapport_mensuel   = item;
            currentItemRapport_mensuel    = JSON.parse(JSON.stringify(vm.selectedItemRapport_mensuel));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemRapport_mensuel', function()
        {
             if (!vm.allrapport_mensuel) return;
             vm.allrapport_mensuel.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_mensuel.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRapport_mensuel = function(item)
        {
            NouvelItemRapport_mensuel = false ;
            vm.selectedItemRapport_mensuel = item;
            currentItemRapport_mensuel = angular.copy(vm.selectedItemRapport_mensuel);
            $scope.vm.allrapport_mensuel.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemRapport_mensuel.description ;
            item.fichier   = vm.selectedItemRapport_mensuel.fichier ;
            item.date_livraison   = new Date(vm.selectedItemRapport_mensuel.date_livraison) ;
            item.observation   = vm.selectedItemRapport_mensuel.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemRapport_mensuel.contrat_be.id ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item rapport_mensuel
        vm.supprimerRapport_mensuel = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutRapport_mensuel(vm.selectedItemRapport_mensuel,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRapport_mensuel (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allrapport_mensuel.filter(function(obj)
                {
                   return obj.id == currentItemRapport_mensuel.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemRapport_mensuel.description )
                    ||(mem[0].fichier   != currentItemRapport_mensuel.fichier )
                    ||(mem[0].date_livraison   != currentItemRapport_mensuel.date_livraison )
                    ||(mem[0].observation   != currentItemRapport_mensuel.observation )                    
                    ||(mem[0].id_contrat_bureau_etude   != currentItemRapport_mensuel.contrat_be.id ))                   
                      { 
                         insert_in_baseRapport_mensuel(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRapport_mensuel(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rapport_mensuel
        function insert_in_baseRapport_mensuel(rapport_mensuel,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRapport_mensuel==false)
            {
                getId = vm.selectedItemRapport_mensuel.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: rapport_mensuel.description,
                    fichier: rapport_mensuel.fichier,
                    date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                    observation: rapport_mensuel.observation,
                    id_contrat_bureau_etude: rapport_mensuel.id_contrat_bureau_etude,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
            {   

              var contr= vm.allcontrat_bureau_etude.filter(function(obj)
                {
                    return obj.id == rapport_mensuel.id_contrat_bureau_etude;
                });
              if (NouvelItemRapport_mensuel == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'rapport_mensuel/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemRapport_mensuel.id
                                              
                          if(file)
                          { 

                            var name_file = contr[0].ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    rapport_mensuel.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: rapport_mensuel.description,
                                                      fichier: rapport_mensuel.fichier,
                                                      date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                                                      observation: rapport_mensuel.observation,
                                                      id_contrat_bureau_etude: rapport_mensuel.id_contrat_bureau_etude,
                                                      validation:0
                                        });
                                      apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
                                      {                                         
                                          rapport_mensuel.$selected = false;
                                          rapport_mensuel.$edit = false;
                                          vm.selectedItemRapport_mensuel = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  rapport_mensuel.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: rapport_mensuel.description,
                                        fichier: rapport_mensuel.fichier,
                                        date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                                        observation: rapport_mensuel.observation,
                                        id_contrat_bureau_etude: rapport_mensuel.id_contrat_bureau_etude,
                                        validation:0               
                                    });
                                  apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
                                  {
                                        
                                      rapport_mensuel.$selected = false;
                                      rapport_mensuel.$edit = false;
                                      vm.selectedItemRapport_mensuel = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }

                        vm.selectedItemRapport_mensuel.contrat_be = contr[0];
                        vm.selectedItemRapport_mensuel.$selected  = false;
                        vm.selectedItemRapport_mensuel.$edit      = false;
                        vm.selectedItemRapport_mensuel ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_mensuel.id;
                      });
                      var chemin= vm.selectedItemRapport_mensuel.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  rapport_mensuel.id  =   String(data.response);              
                  NouvelItemRapport_mensuel = false;
                  
                    var file= vm.myFile[0];
                    
                    var repertoire = 'rapport_mensuel/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = contr[0].ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              rapport_mensuel.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: rapport_mensuel.description,
                                                fichier: rapport_mensuel.fichier,
                                                date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                                                observation: rapport_mensuel.observation,
                                                id_contrat_bureau_etude: rapport_mensuel.id_contrat_bureau_etude,
                                                validation:0
                                  });
                                apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
                                {  
                                    rapport_mensuel.$selected = false;
                                    rapport_mensuel.$edit = false;
                                    vm.selectedItemRapport_mensuel = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            rapport_mensuel.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: rapport_mensuel.description,
                                  fichier: rapport_mensuel.fichier,
                                  date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                                 observation: rapport_mensuel.observation,
                                  id_contrat_bureau_etude: rapport_mensuel.id_contrat_bureau_etude,
                                  validation:0               
                              });
                            apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
                            {
                                  
                                rapport_mensuel.$selected = false;
                                rapport_mensuel.$edit = false;
                                vm.selectedItemRapport_mensuel = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              rapport_mensuel.contrat_be = contr[0];
              rapport_mensuel.$selected = false;
              rapport_mensuel.$edit = false;
              vm.selectedItemRapport_mensuel = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerRapport_mensuel = function()
        {console.log(vm.selectedItemRapport_mensuel);
          maj_in_baseRapport_mensuel(vm.selectedItemRapport_mensuel,0);
        }

                //fonction selection item justificatif batiment
        vm.selectionRapport_mensuel_valide= function (item)
        {
            vm.selectedItemRapport_mensuel_valide = item;
        };
        $scope.$watch('vm.selectedItemRapport_mensuel_valide', function()
        {
             if (!vm.allrapport_mensuel_valide) return;
             vm.allrapport_mensuel_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_mensuel_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd rapport_mensuel
        function maj_in_baseRapport_mensuel(rapport_mensuel,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        rapport_mensuel.id,
                    description: rapport_mensuel.description,
                    fichier: rapport_mensuel.fichier,
                    date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                    observation: rapport_mensuel.observation,
                    id_contrat_bureau_etude: rapport_mensuel.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
            {   

              vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
              {
                return obj.id !== rapport_mensuel.id;
              });
              vm.allrapport_mensuel_valide.push(rapport_mensuel);
              vm.selectedItemRapport_mensuel = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_rapport_mensuel = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }
/**********************************fin justificatif batiment****************************************/

/**********************************fin mpe_sousmissionnaire****************************************/
        //Alert
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

        function convertionDate(daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

      vm.affichageDate = function (daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= jour+"/"+mois+"/"+annee;
                return date_final
            }      
        }
        
  
  function showDialog($event,items) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '<md-subheader style="background-color: rgb(245,245,245)">'+
            '<h3 mat-dialog-title  style="margin:0px; color: red;">Erreur de suppression de fichier</h3>'+
          '</md-subheader>'+
           '  <md-dialog-content>'+
           '    <p>Veuillez communiquer ce réference à l\'administrateur</p>'+
           '    <p>Réference: {{items}}</p>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Fermer' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: items
         },
         controller: DialogController
      });

    }

      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }
  
})();
