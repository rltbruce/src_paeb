(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.manuel_gestion')
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
        .controller('Manuel_gestionController', Manuel_gestionController);
    /** @ngInject */
    function Manuel_gestionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemBureau_etude = {} ;
        vm.allbureau_etude = [] ;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;        

        vm.ajoutManuel_gestion = ajoutManuel_gestion;
        var NouvelItemManuel_gestion=false;
        var currentItemManuel_gestion;
        vm.selectedItemManuel_gestion = {} ;
        vm.allmanuel_gestion = [] ;
        vm.showbuttonNouvManuel = true;
        vm.showbuttonValidation = false;

        vm.selectedItemManuel_gestion_valide = {} ;
        vm.allmanuel_gestion_valide = [] ;

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
     /*   vm.bureau_etude_column = [
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
            apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
            {
                  vm.allmanuel_gestion = result.data.response;
                  if (vm.allmanuel_gestion.length>0)
                  {
                    vm.showbuttonNouvManuel = false;
                  }
                  
            });

             apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',item.id,'validation',1).then(function(result)
            {
                vm.allmanuel_gestion_valide = result.data.response;                
                  
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
        });        
*/
/**********************************fin contrat prestataire****************************************/


/**********************************fin justificatif attachement****************************************/
      apiFactory.getAll("contrat_be/index").then(function(result)
      {
          vm.allcontrat_bureau_etude = result.data.response; 
          console.log(vm.allcontrat_bureau_etude);
      });

      apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelByvalidation','validation',0).then(function(result)
      {
        vm.allmanuel_gestion = result.data.response;
        
        if (vm.allmanuel_gestion.length>0)
        {
            vm.showbuttonNouvAppel = false;
        }
                  
      });
      apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelByvalidation','validation',1).then(function(result)
      {
        vm.allappel_offre_valide = result.data.response;
                  
      });


        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemManuel_gestion.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemManuel_gestion.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterManuel_gestion = function ()
        { 
          
          if (NouvelItemManuel_gestion == false)
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
        
            vm.allmanuel_gestion.push(items);
            vm.allmanuel_gestion.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemManuel_gestion = mem;
              }
            });

            NouvelItemManuel_gestion = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout manuel_gestion','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutManuel_gestion(manuel_gestion,suppression)
        {
            if (NouvelItemManuel_gestion==false)
            {
                test_existanceManuel_gestion (manuel_gestion,suppression); 
            } 
            else
            {
                insert_in_baseManuel_gestion(manuel_gestion,suppression);
            }
        }

        //fonction de bouton d'annulation manuel_gestion
        vm.annulerManuel_gestion = function(item)
        {
          if (NouvelItemManuel_gestion == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemManuel_gestion.description ;
            item.fichier   = currentItemManuel_gestion.fichier ;
            item.date_livraison   = currentItemManuel_gestion.date_livraison ;
            item.observation   = currentItemManuel_gestion.observation ;
            item.id_contrat_bureau_etude   = currentItemManuel_gestion.id_contrat_bureau_etude ;
          }else
          {
            vm.allmanuel_gestion = vm.allmanuel_gestion.filter(function(obj)
            {
                return obj.id !== vm.selectedItemManuel_gestion.id;
            });
          }

          vm.selectedItemManuel_gestion = {} ;
          NouvelItemManuel_gestion      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionManuel_gestion= function (item)
        {
            vm.selectedItemManuel_gestion = item;
            vm.nouvelItemManuel_gestion   = item;
            currentItemManuel_gestion    = JSON.parse(JSON.stringify(vm.selectedItemManuel_gestion));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemManuel_gestion', function()
        {
             if (!vm.allmanuel_gestion) return;
             vm.allmanuel_gestion.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemManuel_gestion.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierManuel_gestion = function(item)
        {
            NouvelItemManuel_gestion = false ;
            vm.selectedItemManuel_gestion = item;
            currentItemManuel_gestion = angular.copy(vm.selectedItemManuel_gestion);
            $scope.vm.allmanuel_gestion.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemManuel_gestion.description ;
            item.fichier   = vm.selectedItemManuel_gestion.fichier ;
            item.date_livraison   = new Date(vm.selectedItemManuel_gestion.date_livraison) ;
            item.observation   = vm.selectedItemManuel_gestion.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemManuel_gestion.contrat_be.id ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item manuel_gestion
        vm.supprimerManuel_gestion = function()
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
                vm.ajoutManuel_gestion(vm.selectedItemManuel_gestion,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceManuel_gestion (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allmanuel_gestion.filter(function(obj)
                {
                   return obj.id == currentItemManuel_gestion.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemManuel_gestion.description )
                    ||(mem[0].fichier   != currentItemManuel_gestion.fichier )
                    ||(mem[0].date_livraison   != currentItemManuel_gestion.date_livraison )
                    ||(mem[0].observation   != currentItemManuel_gestion.observation )                    
                    ||(mem[0].id_contrat_bureau_etude   != currentItemManuel_gestion.contrat_be.id ))                   
                      { 
                         insert_in_baseManuel_gestion(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseManuel_gestion(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd manuel_gestion
        function insert_in_baseManuel_gestion(manuel_gestion,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemManuel_gestion==false)
            {
                getId = vm.selectedItemManuel_gestion.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: manuel_gestion.description,
                    fichier: manuel_gestion.fichier,
                    date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                    observation: manuel_gestion.observation,
                    id_contrat_bureau_etude: manuel_gestion.id_contrat_bureau_etude,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
            {   


              var contr= vm.allcontrat_bureau_etude.filter(function(obj)
                {
                    return obj.id == manuel_gestion.id_contrat_bureau_etude;
                });
              if (NouvelItemManuel_gestion == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'manuel_gestion/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemManuel_gestion.id
                                              
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
                                    manuel_gestion.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: manuel_gestion.description,
                                                      fichier: manuel_gestion.fichier,
                                                      date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                                                      observation: manuel_gestion.observation,
                                                      id_contrat_bureau_etude: manuel_gestion.id_contrat_bureau_etude,
                                                      validation:0
                                        });
                                      apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          manuel_gestion.$selected = false;
                                          manuel_gestion.$edit = false;
                                          vm.selectedItemManuel_gestion = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  manuel_gestion.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: manuel_gestion.description,
                                        fichier: manuel_gestion.fichier,
                                        date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                                       observation: manuel_gestion.observation,
                                        id_contrat_bureau_etude: manuel_gestion.id_contrat_bureau_etude,
                                        validation:0               
                                    });
                                  apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
                                  {
                                        
                                      manuel_gestion.$selected = false;
                                      manuel_gestion.$edit = false;
                                      vm.selectedItemManuel_gestion = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }

                        vm.selectedItemManuel_gestion.contrat_be = contr[0];
                        vm.selectedItemManuel_gestion.$selected  = false;
                        vm.selectedItemManuel_gestion.$edit      = false;
                        vm.selectedItemManuel_gestion ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allmanuel_gestion = vm.allmanuel_gestion.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemManuel_gestion.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemManuel_gestion.fichier;
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
                  manuel_gestion.id  =   String(data.response);              
                  NouvelItemManuel_gestion = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'manuel_gestion/';
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
                              manuel_gestion.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: manuel_gestion.description,
                                                fichier: manuel_gestion.fichier,
                                                date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                                               observation: manuel_gestion.observation,
                                                id_contrat_bureau_etude: manuel_gestion.id_contrat_bureau_etude,
                                                validation:0
                                  });
                                apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    manuel_gestion.$selected = false;
                                    manuel_gestion.$edit = false;
                                    vm.selectedItemManuel_gestion = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            manuel_gestion.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: manuel_gestion.description,
                                  fichier: manuel_gestion.fichier,
                                  date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                                  observation: manuel_gestion.observation,
                                  id_contrat_bureau_etude: manuel_gestion.id_contrat_bureau_etude,
                                  validation:0               
                              });
                            apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
                            {
                                  
                                manuel_gestion.$selected = false;
                                manuel_gestion.$edit = false;
                                vm.selectedItemManuel_gestion = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              manuel_gestion.contrat_be = contr[0];
              manuel_gestion.$selected = false;
              manuel_gestion.$edit = false;
              vm.selectedItemManuel_gestion = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerManuel_gestion = function()
        {
          maj_in_baseManuel_gestion(vm.selectedItemManuel_gestion,0);
        }

        vm.selectionManuel_gestion_valide= function (item)
        {
            vm.selectedItemManuel_gestion_valide = item;
        };
        $scope.$watch('vm.selectedItemManuel_gestion_valide', function()
        {
             if (!vm.allmanuel_gestion_valide) return;
             vm.allmanuel_gestion_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemManuel_gestion_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd manuel_gestion
        function maj_in_baseManuel_gestion(manuel_gestion,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        manuel_gestion.id,
                    description: manuel_gestion.description,
                    fichier: manuel_gestion.fichier,
                    date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                   observation: manuel_gestion.observation,
                    id_contrat_bureau_etude: manuel_gestion.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
            {   

              vm.allmanuel_gestion = vm.allmanuel_gestion.filter(function(obj)
              {
                return obj.id !== manuel_gestion.id;
              });
              vm.allmanuel_gestion_valide.push(manuel_gestion);
              vm.selectedItemManuel_gestion = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_manuel_gestion = function(item)
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
