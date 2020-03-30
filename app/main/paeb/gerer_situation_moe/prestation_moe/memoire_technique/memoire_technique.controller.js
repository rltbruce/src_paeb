(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.prestation_moe.memoire_technique')
      /*  .directive('customOnChange', function() {
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
    }])*/
    //.controller('DialogController', DialogController)
        .controller('Memoire_techniqueController', Memoire_techniqueController);
    /** @ngInject */
    function Memoire_techniqueController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;
        vm.selectedItemBureau_etude = {} ;
        vm.allbureau_etude = [] ;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;        

        vm.ajoutMemoire_technique = ajoutMemoire_technique;
        var NouvelItemMemoire_technique=false;
        var currentItemMemoire_technique;
        vm.selectedItemMemoire_technique = {} ;
        vm.allmemoire_technique = [] ;
        vm.showbuttonNouvMemoire = true;
        vm.showbuttonValidation = false;

        vm.selectedItemMemoire_technique_valide = {} ;
        vm.allmemoire_technique_valide = [] ;

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
      /*  vm.bureau_etude_column = [
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
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
            {
                  vm.allmemoire_technique = result.data.response;
                  if (vm.allmemoire_technique.length>0)
                  {
                    vm.showbuttonNouvMemoire = false;
                  }
                  
            });

             apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',item.id,'validation',1).then(function(result)
            {
                vm.allmemoire_technique_valide = result.data.response;                
                  
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
        });  */      

/**********************************fin contrat prestataire****************************************/
      var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allcontrat_bureau_etude = result.data.response; 
                console.log(vm.allcontrat_bureau_etude);
            });

            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoirevalidationBycisco','validation',0).then(function(result)
            {
              vm.allmemoire_technique = result.data.response;
              
              if (vm.allmemoire_technique.length>0)
              {
                  vm.showbuttonNouvMemoire = false;
              }
                        
            });
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoirevalidationBycisco','validation',1).then(function(result)
            {
              vm.allmemoire_technique_valide = result.data.response;
                        
            });
          }
          

        });

/**********************************fin justificatif attachement****************************************/
      /*apiFactory.getAll("contrat_be/index").then(function(result)
      {
          vm.allcontrat_bureau_etude = result.data.response; 
          console.log(vm.allcontrat_bureau_etude);
      });*/

      
        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemMemoire_technique.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemMemoire_technique.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterMemoire_technique = function ()
        { 
          
          if (NouvelItemMemoire_technique == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
             // fichier: '',
              date_livraison: '',
              date_approbation: '',
              observation: '',
              id_contrat_bureau_etude: ''
            };
        
            vm.allmemoire_technique.push(items);
            vm.allmemoire_technique.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemMemoire_technique = mem;
              }
            });

            NouvelItemMemoire_technique = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout memoire_technique','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMemoire_technique(memoire_technique,suppression)
        {
            if (NouvelItemMemoire_technique==false)
            {
                test_existanceMemoire_technique (memoire_technique,suppression); 
            } 
            else
            {
                insert_in_baseMemoire_technique(memoire_technique,suppression);
            }
        }

        //fonction de bouton d'annulation memoire_technique
        vm.annulerMemoire_technique = function(item)
        {
          if (NouvelItemMemoire_technique == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemMemoire_technique.description ;
            //item.fichier   = currentItemMemoire_technique.fichier ;
            item.date_livraison   = currentItemMemoire_technique.date_livraison ;
            item.date_approbation   = currentItemMemoire_technique.date_approbation ;
            item.observation   = currentItemMemoire_technique.observation ;
            item.id_contrat_bureau_etude   = currentItemMemoire_technique.id_contrat_bureau_etude ;
          }else
          {
            vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMemoire_technique.id;
            });
          }

          vm.selectedItemMemoire_technique = {} ;
          NouvelItemMemoire_technique      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionMemoire_technique= function (item)
        {
            vm.selectedItemMemoire_technique = item;
            vm.nouvelItemMemoire_technique   = item;
            currentItemMemoire_technique    = JSON.parse(JSON.stringify(vm.selectedItemMemoire_technique));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemMemoire_technique', function()
        {
             if (!vm.allmemoire_technique) return;
             vm.allmemoire_technique.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMemoire_technique.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierMemoire_technique = function(item)
        {
            NouvelItemMemoire_technique = false ;
            vm.selectedItemMemoire_technique = item;
            currentItemMemoire_technique = angular.copy(vm.selectedItemMemoire_technique);
            $scope.vm.allmemoire_technique.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemMemoire_technique.description ;
            //item.fichier   = vm.selectedItemMemoire_technique.fichier ;
            item.date_livraison   = new Date(vm.selectedItemMemoire_technique.date_livraison) ;
            item.date_approbation   = new Date(vm.selectedItemMemoire_technique.date_approbation) ;
            item.observation   = vm.selectedItemMemoire_technique.observation ;

            item.id_contrat_bureau_etude   = vm.selectedItemMemoire_technique.contrat_be.id ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item memoire_technique
        vm.supprimerMemoire_technique = function()
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
                vm.ajoutMemoire_technique(vm.selectedItemMemoire_technique,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceMemoire_technique (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allmemoire_technique.filter(function(obj)
                {
                   return obj.id == currentItemMemoire_technique.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemMemoire_technique.description )
                    //||(mem[0].fichier   != currentItemMemoire_technique.fichier )
                    ||(mem[0].date_livraison   != currentItemMemoire_technique.date_livraison )
                    ||(mem[0].date_approbation   != currentItemMemoire_technique.date_approbation )
                    ||(mem[0].observation   != currentItemMemoire_technique.observation )
                    ||(mem[0].id_contrat_bureau_etude   != currentItemMemoire_technique.contrat_be.id ))                   
                      { 
                         insert_in_baseMemoire_technique(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMemoire_technique(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd memoire_technique

        function insert_in_baseMemoire_technique(memoire_technique,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMemoire_technique==false)
            {
                getId = vm.selectedItemMemoire_technique.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: memoire_technique.description,
                    //fichier: memoire_technique.fichier,
                    date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                    date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                    observation: memoire_technique.observation,
                    id_contrat_bureau_etude: memoire_technique.id_contrat_bureau_etude,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("memoire_technique/index",datas, config).success(function (data)
            {   
              var contr= vm.allcontrat_bureau_etude.filter(function(obj)
                {
                    return obj.id == memoire_technique.id_contrat_bureau_etude;
                });

              if (NouvelItemMemoire_technique == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                        vm.selectedItemMemoire_technique.contrat_be = contr[0];
                        vm.selectedItemMemoire_technique.$selected  = false;
                        vm.selectedItemMemoire_technique.$edit      = false;
                        vm.selectedItemMemoire_technique ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMemoire_technique.id;
                      });
                      vm.showbuttonNouvMemoire = true;                     
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  memoire_technique.id  =   String(data.response);              
                  NouvelItemMemoire_technique = false;
                  vm.showbuttonNouvMemoire = false;                
                    
              }
              memoire_technique.contrat_be = contr[0];
              memoire_technique.$selected = false;
              memoire_technique.$edit = false;
              vm.selectedItemMemoire_technique = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        /*function insert_in_baseMemoire_technique(memoire_technique,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMemoire_technique==false)
            {
                getId = vm.selectedItemMemoire_technique.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: memoire_technique.description,
                    fichier: memoire_technique.fichier,
                    date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                    date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                    observation: memoire_technique.observation,
                    id_contrat_bureau_etude: memoire_technique.id_contrat_bureau_etude,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("memoire_technique/index",datas, config).success(function (data)
            {   
              var contr= vm.allcontrat_bureau_etude.filter(function(obj)
                {
                    return obj.id == memoire_technique.id_contrat_bureau_etude;
                });

              if (NouvelItemMemoire_technique == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'memoire_technique/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemMemoire_technique.id
                                              
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
                                    memoire_technique.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: memoire_technique.description,
                                                      fichier: memoire_technique.fichier,
                                                      date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                                                      date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                                                      observation: memoire_technique.observation,
                                                      id_contrat_bureau_etude: memoire_technique.id_contrat_bureau_etude,
                                                      validation:0
                                        });
                                      apiFactory.add("memoire_technique/index",datas, config).success(function (data)
                                      {  
                                         
                                          vm.showbuttonNouvMemoire = true;
                                          memoire_technique.$selected = false;
                                          memoire_technique.$edit = false;
                                          vm.selectedItemMemoire_technique = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  memoire_technique.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: memoire_technique.description,
                                        fichier: memoire_technique.fichier,
                                        date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                                        date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                                        observation: memoire_technique.observation,
                                        id_contrat_bureau_etude: memoire_technique.id_contrat_bureau_etude,
                                        validation:0               
                                    });
                                  apiFactory.add("memoire_technique/index",datas, config).success(function (data)
                                  {
                                       
                                      memoire_technique.$selected = false;
                                      memoire_technique.$edit = false;
                                      vm.selectedItemMemoire_technique = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }

                        vm.selectedItemMemoire_technique.contrat_be = contr[0];
                        vm.selectedItemMemoire_technique.$selected  = false;
                        vm.selectedItemMemoire_technique.$edit      = false;
                        vm.selectedItemMemoire_technique ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMemoire_technique.id;
                      });
                      vm.showbuttonNouvMemoire = true;
                      var chemin= vm.selectedItemMemoire_technique.fichier;
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
                  memoire_technique.id  =   String(data.response);              
                  NouvelItemMemoire_technique = false;

                  vm.showbuttonNouvMemoire = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'memoire_technique/';
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
                              memoire_technique.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: memoire_technique.description,
                                                fichier: memoire_technique.fichier,
                                                date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                                                date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                                                observation: memoire_technique.observation,
                                                id_contrat_bureau_etude: memoire_technique.id_contrat_bureau_etude,
                                                validation:0
                                  });
                                apiFactory.add("memoire_technique/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvMemoire = true;
                                    memoire_technique.$selected = false;
                                    memoire_technique.$edit = false;
                                    vm.selectedItemMemoire_technique = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            memoire_technique.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: memoire_technique.description,
                                  fichier: memoire_technique.fichier,
                                  date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                                  date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                                  observation: memoire_technique.observation,
                                  id_contrat_bureau_etude: memoire_technique.id_contrat_bureau_etude,
                                  validation:0               
                              });
                            apiFactory.add("memoire_technique/index",datas, config).success(function (data)
                            {
                                  
                                memoire_technique.$selected = false;
                                memoire_technique.$edit = false;
                                vm.selectedItemMemoire_technique = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              memoire_technique.contrat_be = contr[0];
              memoire_technique.$selected = false;
              memoire_technique.$edit = false;
              vm.selectedItemMemoire_technique = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }*/
        vm.validerMemoire_technique = function()
        {
          maj_in_baseMemoire_technique(vm.selectedItemMemoire_technique,0);
        }

        vm.selectionMemoire_technique_valide= function (item)
        {
            vm.selectedItemMemoire_technique_valide = item;
        };
        $scope.$watch('vm.selectedItemMemoire_technique_valide', function()
        {
             if (!vm.allmemoire_technique_valide) return;
             vm.allmemoire_technique_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMemoire_technique_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd memoire_technique
        function maj_in_baseMemoire_technique(memoire_technique,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        memoire_technique.id,
                    description: memoire_technique.description,
                    //fichier: memoire_technique.fichier,
                    date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                    date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                    observation: memoire_technique.observation,
                    id_contrat_bureau_etude: memoire_technique.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("memoire_technique/index",datas, config).success(function (data)
            {   

              vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
              {
                return obj.id !== memoire_technique.id;
              });
              vm.allmemoire_technique_valide.push(memoire_technique);
              vm.selectedItemMemoire_technique = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_memoire_technique = function(item)
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
