(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_payement_prestataire')
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
        .controller('Demande_payement_prestataireController', Demande_payement_prestataireController);
    /** @ngInject */
    function Demande_payement_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutDemande_payement_prest = ajoutDemande_payement_prest ;
        var NouvelItemDemande_payement_prest=false;
        var currentItemDemande_payement_prest;
        vm.selectedItemDemande_payement_prest = {} ;
        vm.alldemande_payement_prest = [] ;

        vm.ajoutJustificatif_attachement = ajoutJustificatif_attachement ;
        var NouvelItemJustificatif_attachement=false;
        var currentItemJustificatif_attachement;
        vm.selectedItemJustificatif_attachement = {} ;
        vm.alljustificatif_attachement = [] ;

        vm.ajoutJustificatif_facture = ajoutJustificatif_facture ;
        var NouvelItemJustificatif_facture=false;
        var currentItemJustificatif_facture;
        vm.selectedItemJustificatif_facture = {} ;
        vm.alljustificatif_facture = [] ;

        vm.ajoutJustificatif_autre = ajoutJustificatif_autre ;
        var NouvelItemJustificatif_autre=false;
        var currentItemJustificatif_autre;
        vm.selectedItemJustificatif_autre = {} ;
        vm.alljustificatif_autre = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.showbuttonNouvPassation=true;
        vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

        //col table
        vm.contrat_prestataire_column = [
        {titre:"Numero contrat"
        },
        {titre:"Description"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];
 
/**********************************fin contrat prestataire****************************************/       
        //recuperation donnée convention
        apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemContrat_prestataire.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("demande_payement_prestataire/index",'menu','getdemandeInvalide','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.alldemande_payement_prest = result.data.response;

                  if (vm.alldemande_payement_prest.length!=0)
                  {
                    vm.showbuttonNouvPassation=false;
                  }
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemContrat_prestataire', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allcontrat_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_prestataire.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

/**********************************debut demande_payement_prest****************************************/
//col table
        vm.demande_payement_prest_column = [
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Montant"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterDemande_payement_prest = function ()
        { 
          if (NouvelItemDemande_payement_prest == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              objet: '',
              description: '',
              ref_facture: '',
              montant: '',
              date: ''
            };         
            vm.alldemande_payement_prest.push(items);
            vm.alldemande_payement_prest.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_payement_prest = mem;
              }
            });

            NouvelItemDemande_payement_prest = true ;
          }else
          {
            vm.showAlert('Ajout demande payement','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_payement_prest(demande_payement_prest,suppression)
        {
            if (NouvelItemDemande_payement_prest==false)
            {
                test_existanceDemande_payement_prest (demande_payement_prest,suppression); 
            } 
            else
            {
                insert_in_baseDemande_payement_prest(demande_payement_prest,suppression);
            }
        }

        //fonction de bouton d'annulation demande_payement_prest
        vm.annulerDemande_payement_prest = function(item)
        {
          if (NouvelItemDemande_payement_prest == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_payement_prest.objet ;
            item.description   = currentItemDemande_payement_prest.description ;
            item.ref_facture   = currentItemDemande_payement_prest.ref_facture ;
            item.montant   = currentItemDemande_payement_prest.montant ;
            item.date  = currentItemDemande_payement_prest.date;
          }else
          {
            vm.alldemande_payement_prest = vm.alldemande_payement_prest.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_payement_prest.id;
            });
          }

          vm.selectedItemDemande_payement_prest = {} ;
          NouvelItemDemande_payement_prest      = false;
          
        };

        //fonction selection item Demande_payement_prest
        vm.selectionDemande_payement_prest= function (item)
        {
            vm.selectedItemDemande_payement_prest = item;
            vm.nouvelItemDemande_payement_prest   = item;
            currentItemDemande_payement_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_payement_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_attachement/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_attachement = result.data.response;
                console.log(vm.alljustificatif_attachement);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_facture/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_facture = result.data.response;
                console.log(vm.alljustificatif_facture);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_autre_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_autre = result.data.response;
                console.log(vm.alljustificatif_autre);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_payement_prest', function()
        {
             if (!vm.alldemande_payement_prest) return;
             vm.alldemande_payement_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_payement_prest.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_payement_prest = function(item)
        {
            NouvelItemDemande_payement_prest = false ;
            vm.selectedItemDemande_payement_prest = item;
            currentItemDemande_payement_prest = angular.copy(vm.selectedItemDemande_payement_prest);
            $scope.vm.alldemande_payement_prest.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_payement_prest.objet ;
            item.description   = vm.selectedItemDemande_payement_prest.description ;
            item.ref_facture   = vm.selectedItemDemande_payement_prest.ref_facture ;
            item.montant   = parseInt(vm.selectedItemDemande_payement_prest.montant);
            item.date   =new Date(vm.selectedItemDemande_payement_prest.date) ;
        };

        //fonction bouton suppression item Demande_payement_prest
        vm.supprimerDemande_payement_prest = function()
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
                vm.ajoutDemande_payement_prest(vm.selectedItemDemande_payement_prest,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_payement_prest (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_payement_prest.filter(function(obj)
                {
                   return obj.id == currentItemDemande_payement_prest.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_payement_prest.objet )
                    || (pass[0].description   != currentItemDemande_payement_prest.description )
                    || (pass[0].montant   != currentItemDemande_payement_prest.montant )
                    || (pass[0].date   != currentItemDemande_payement_prest.date )
                    || (pass[0].ref_facture   != currentItemDemande_payement_prest.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_payement_prest(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_payement_prest(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_payement_prest
        function insert_in_baseDemande_payement_prest(demande_payement_prest,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_payement_prest==false)
            {
                getId = vm.selectedItemDemande_payement_prest.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_payement_prest.objet,
                    description:demande_payement_prest.description,
                    ref_facture:demande_payement_prest.ref_facture,
                    montant: demande_payement_prest.montant,
                    date: convertionDate(new Date(demande_payement_prest.date)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_payement_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemDemande_payement_prest == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_payement_prest.objet   = demande_payement_prest.objet ;
                        vm.selectedItemDemande_payement_prest.description   = demande_payement_prest.description ;
                        vm.selectedItemDemande_payement_prest.ref_facture   = demande_payement_prest.ref_facture ;
                        vm.selectedItemDemande_payement_prest.montant   = demande_payement_prest.montant ;
                        vm.selectedItemDemande_payement_prest.date   = demande_payement_prest.date ;
                        
                        vm.selectedItemDemande_payement_prest.$selected  = false;
                        vm.selectedItemDemande_payement_prest.$edit      = false;
                        vm.selectedItemDemande_payement_prest ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.alldemande_payement_prest = vm.alldemande_payement_prest.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_payement_prest.id;
                      });
                    }
                    
                }
                else
                {
                  demande_payement_prest.objet   = demande_payement_prest.objet ;
                  demande_payement_prest.description   = demande_payement_prest.description ;
                  demande_payement_prest.ref_facture   = demande_payement_prest.ref_facture ;
                  demande_payement_prest.montant   = demande_payement_prest.montant ;
                  demande_payement_prest.date   = demande_payement_prest.date ;

                  demande_payement_prest.id  =   String(data.response);              
                  NouvelItemDemande_payement_prest=false;
            }
              demande_payement_prest.$selected = false;
              demande_payement_prest.$edit = false;
              vm.selectedItemDemande_payement_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin demande_payement_prest****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_attachement_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_attachement.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_attachement.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_attachement = function ()
        { 
          if (NouvelItemJustificatif_attachement == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_attachement.push(items);
            vm.alljustificatif_attachement.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_attachement = mem;
              }
            });

            NouvelItemJustificatif_attachement = true ;
            vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_attachement','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_attachement(justificatif_attachement,suppression)
        {
            if (NouvelItemJustificatif_attachement==false)
            {
                test_existanceJustificatif_attachement (justificatif_attachement,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_attachement(justificatif_attachement,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_attachement
        vm.annulerJustificatif_attachement = function(item)
        {
          if (NouvelItemJustificatif_attachement == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_attachement.description ;
            item.fichier   = currentItemJustificatif_attachement.fichier ;
          }else
          {
            vm.alljustificatif_attachement = vm.alljustificatif_attachement.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_attachement.id;
            });
          }

          vm.selectedItemJustificatif_attachement = {} ;
          NouvelItemJustificatif_attachement      = false;
          
        };

        //fonction selection item region
        vm.selectionJustificatif_attachement= function (item)
        {
            vm.selectedItemJustificatif_attachement = item;
            vm.nouvelItemJustificatif_attachement   = item;
            currentItemJustificatif_attachement    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_attachement)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_attachement', function()
        {
             if (!vm.alljustificatif_attachement) return;
             vm.alljustificatif_attachement.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_attachement.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_attachement = function(item)
        {
            NouvelItemJustificatif_attachement = false ;
            vm.selectedItemJustificatif_attachement = item;
            currentItemJustificatif_attachement = angular.copy(vm.selectedItemJustificatif_attachement);
            $scope.vm.alljustificatif_attachement.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_attachement.description ;
            item.fichier   = vm.selectedItemJustificatif_attachement.fichier ;
            vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_attachement
        vm.supprimerJustificatif_attachement = function()
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
                vm.ajoutJustificatif_attachement(vm.selectedItemJustificatif_attachement,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_attachement (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_attachement.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_attachement.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_attachement.description )
                    ||(just[0].fichier   != currentItemJustificatif_attachement.fichier ))                   
                      { 
                         insert_in_baseJustificatif_attachement(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_attachement(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_attachement
        function insert_in_baseJustificatif_attachement(justificatif_attachement,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_attachement==false)
            {
                getId = vm.selectedItemJustificatif_attachement.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_attachement.description,
                    fichier: justificatif_attachement.fichier,
                    id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_attachement/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'justificatif_attachement/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemJustificatif_attachement==false)
                {
                    getIdFile = vm.selectedItemJustificatif_attachement.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_attachement' ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          justificatif_attachement.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_attachement.description,
                              fichier: justificatif_attachement.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                          });
                            apiFactory.add("justificatif_attachement/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_attachement == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_attachement.description = justificatif_attachement.description;
                                      vm.selectedItemJustificatif_attachement.fichier = justificatif_attachement.fichier;
                                      vm.selectedItemJustificatif_attachement.$selected  = false;
                                      vm.selectedItemJustificatif_attachement.$edit      = false;
                                      vm.selectedItemJustificatif_attachement ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_attachement = vm.alljustificatif_attachement.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_attachement.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_attachement.description = justificatif_attachement.description;
                                justificatif_attachement.fichier = justificatif_attachement.fichier; 

                                justificatif_attachement.id  =   String(data.response);              
                                NouvelItemJustificatif_attachement=false;
                          }
                            justificatif_attachement.$selected = false;
                            justificatif_attachement.$edit = false;
                            vm.selectedItemJustificatif_attachement = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        justificatif_attachement.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_attachement.description,
                              fichier: justificatif_attachement.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                          });
                        apiFactory.add("justificatif_attachement/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_attachement == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_attachement.description = justificatif_attachement.description;
                                      vm.selectedItemJustificatif_attachement.fichier = justificatif_attachement.fichier;
                                      vm.selectedItemJustificatif_attachement.$selected  = false;
                                      vm.selectedItemJustificatif_attachement.$edit      = false;
                                      vm.selectedItemJustificatif_attachement ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_attachement = vm.alljustificatif_attachement.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_attachement.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_attachement.description = justificatif_attachement.description;
                                justificatif_attachement.fichier = justificatif_attachement.fichier; 

                                justificatif_attachement.id  =   String(data.response);              
                                NouvelItemJustificatif_attachement=false;
                          }
                            justificatif_attachement.$selected = false;
                            justificatif_attachement.$edit = false;
                            vm.selectedItemJustificatif_attachement = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }

               /* if (NouvelItemJustificatif_attachement == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemJustificatif_attachement.description = justificatif_attachement.description;
                        vm.selectedItemJustificatif_attachement.fichier = justificatif_attachement.fichier;
                        vm.selectedItemJustificatif_attachement.$selected  = false;
                        vm.selectedItemJustificatif_attachement.$edit      = false;
                        vm.selectedItemJustificatif_attachement ={};
                    }
                    else 
                    {    
                      vm.alljustificatif_attachement = vm.alljustificatif_attachement.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_attachement.id;
                      });
                    }
                }
                else
                {
                  justificatif_attachement.description = justificatif_attachement.description;
                  justificatif_attachement.fichier = justificatif_attachement.fichier; 

                  justificatif_attachement.id  =   String(data.response);              
                  NouvelItemJustificatif_attachement=false;
            }
              justificatif_attachement.$selected = false;
              justificatif_attachement.$edit = false;
              vm.selectedItemJustificatif_attachement = {};*/
            vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin mpe_sousmissionnaire****************************************/

/**********************************Debut justificatif facture****************************************/

//col table
        vm.justificatif_facture_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFileFacture = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_facture.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_facture = function ()
        { 
          if (NouvelItemJustificatif_facture == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_facture.push(items);
            vm.alljustificatif_facture.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_facture = mem;
              }
            });

            NouvelItemJustificatif_facture = true ;
            vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_facture','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_facture(justificatif_facture,suppression)
        {
            if (NouvelItemJustificatif_facture==false)
            {
                test_existanceJustificatif_facture (justificatif_facture,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_facture(justificatif_facture,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_facture
        vm.annulerJustificatif_facture = function(item)
        {
          if (NouvelItemJustificatif_facture == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_facture.description ;
            item.fichier   = currentItemJustificatif_facture.fichier ;
          }else
          {
            vm.alljustificatif_facture = vm.alljustificatif_facture.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_facture.id;
            });
          }

          vm.selectedItemJustificatif_facture = {} ;
          NouvelItemJustificatif_facture      = false;
          
        };

        //fonction selection item region
        vm.selectionJustificatif_facture= function (item)
        {
            vm.selectedItemJustificatif_facture = item;
            vm.nouvelItemJustificatif_facture   = item;
            currentItemJustificatif_facture    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_facture)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_facture', function()
        {
             if (!vm.alljustificatif_facture) return;
             vm.alljustificatif_facture.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_facture.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_facture = function(item)
        {
            NouvelItemJustificatif_facture = false ;
            vm.selectedItemJustificatif_facture = item;
            currentItemJustificatif_facture = angular.copy(vm.selectedItemJustificatif_facture);
            $scope.vm.alljustificatif_facture.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_facture.description ;
            item.fichier   = vm.selectedItemJustificatif_facture.fichier ;
            vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_facture
        vm.supprimerJustificatif_facture = function()
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
                vm.ajoutJustificatif_facture(vm.selectedItemJustificatif_facture,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_facture (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_facture.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_facture.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_facture.description )
                    ||(just[0].fichier   != currentItemJustificatif_facture.fichier ))                   
                      { 
                         insert_in_baseJustificatif_facture(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_facture(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_facture
        function insert_in_baseJustificatif_facture(justificatif_facture,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_facture==false)
            {
                getId = vm.selectedItemJustificatif_facture.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_facture.description,
                    fichier: justificatif_facture.fichier,
                    id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_facture/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'justificatif_facture/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemJustificatif_facture==false)
                {
                    getIdFile = vm.selectedItemJustificatif_facture.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_facture' ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          justificatif_facture.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_facture.description,
                              fichier: justificatif_facture.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                          });
                            apiFactory.add("justificatif_facture/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_facture == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_facture.description = justificatif_facture.description;
                                      vm.selectedItemJustificatif_facture.fichier = justificatif_facture.fichier;
                                      vm.selectedItemJustificatif_facture.$selected  = false;
                                      vm.selectedItemJustificatif_facture.$edit      = false;
                                      vm.selectedItemJustificatif_facture ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_facture = vm.alljustificatif_facture.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_facture.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_facture.description = justificatif_facture.description;
                                justificatif_facture.fichier = justificatif_facture.fichier; 

                                justificatif_facture.id  =   String(data.response);              
                                NouvelItemJustificatif_facture=false;
                          }
                            justificatif_facture.$selected = false;
                            justificatif_facture.$edit = false;
                            vm.selectedItemJustificatif_facture = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        justificatif_facture.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_facture.description,
                              fichier: justificatif_facture.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                          });
                        apiFactory.add("justificatif_facture/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_facture == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_facture.description = justificatif_facture.description;
                                      vm.selectedItemJustificatif_facture.fichier = justificatif_facture.fichier;
                                      vm.selectedItemJustificatif_facture.$selected  = false;
                                      vm.selectedItemJustificatif_facture.$edit      = false;
                                      vm.selectedItemJustificatif_facture ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_facture = vm.alljustificatif_facture.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_facture.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_facture.description = justificatif_facture.description;
                                justificatif_facture.fichier = justificatif_facture.fichier; 

                                justificatif_facture.id  =   String(data.response);              
                                NouvelItemJustificatif_facture=false;
                          }
                            justificatif_facture.$selected = false;
                            justificatif_facture.$edit = false;
                            vm.selectedItemJustificatif_facture = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin mpe_sousmissionnaire****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_autre_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFileAutre = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_autre.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_autre = function ()
        { 
          if (NouvelItemJustificatif_autre == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_autre.push(items);
            vm.alljustificatif_autre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_autre = mem;
              }
            });

            NouvelItemJustificatif_autre = true ;
            vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_autre','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_autre(justificatif_autre,suppression)
        {
            if (NouvelItemJustificatif_autre==false)
            {
                test_existanceJustificatif_autre (justificatif_autre,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_autre(justificatif_autre,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_autre
        vm.annulerJustificatif_autre = function(item)
        {
          if (NouvelItemJustificatif_autre == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_autre.description ;
            item.fichier   = currentItemJustificatif_autre.fichier ;
          }else
          {
            vm.alljustificatif_autre = vm.alljustificatif_autre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_autre.id;
            });
          }

          vm.selectedItemJustificatif_autre = {} ;
          NouvelItemJustificatif_autre      = false;
          
        };

        //fonction selection item region
        vm.selectionJustificatif_autre= function (item)
        {
            vm.selectedItemJustificatif_autre = item;
            vm.nouvelItemJustificatif_autre   = item;
            currentItemJustificatif_autre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_autre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_autre', function()
        {
             if (!vm.alljustificatif_autre) return;
             vm.alljustificatif_autre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_autre.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_autre = function(item)
        {
            NouvelItemJustificatif_autre = false ;
            vm.selectedItemJustificatif_autre = item;
            currentItemJustificatif_autre = angular.copy(vm.selectedItemJustificatif_autre);
            $scope.vm.alljustificatif_autre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_autre.description ;
            item.fichier   = vm.selectedItemJustificatif_autre.fichier ;
            vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_autre
        vm.supprimerJustificatif_autre = function()
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
                vm.ajoutJustificatif_autre(vm.selectedItemJustificatif_autre,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_autre (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_autre.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_autre.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_autre.description )
                    ||(just[0].fichier   != currentItemJustificatif_autre.fichier ))                   
                      { 
                         insert_in_baseJustificatif_autre(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_autre(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_autre
        function insert_in_baseJustificatif_autre(justificatif_autre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_autre==false)
            {
                getId = vm.selectedItemJustificatif_autre.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_autre.description,
                    fichier: justificatif_autre.fichier,
                    id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_autre_pre/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'justificatif_autre/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemJustificatif_autre==false)
                {
                    getIdFile = vm.selectedItemJustificatif_autre.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_autre' ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          justificatif_autre.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_autre.description,
                              fichier: justificatif_autre.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                          });
                            apiFactory.add("justificatif_autre_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_autre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_autre.description = justificatif_autre.description;
                                      vm.selectedItemJustificatif_autre.fichier = justificatif_autre.fichier;
                                      vm.selectedItemJustificatif_autre.$selected  = false;
                                      vm.selectedItemJustificatif_autre.$edit      = false;
                                      vm.selectedItemJustificatif_autre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_autre = vm.alljustificatif_autre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_autre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_autre.description = justificatif_autre.description;
                                justificatif_autre.fichier = justificatif_autre.fichier; 

                                justificatif_autre.id  =   String(data.response);              
                                NouvelItemJustificatif_autre=false;
                          }
                            justificatif_autre.$selected = false;
                            justificatif_autre.$edit = false;
                            vm.selectedItemJustificatif_autre = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        justificatif_autre.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_autre.description,
                              fichier: justificatif_autre.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_payement_prest.id               
                          });
                        apiFactory.add("justificatif_autre_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_autre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_autre.description = justificatif_autre.description;
                                      vm.selectedItemJustificatif_autre.fichier = justificatif_autre.fichier;
                                      vm.selectedItemJustificatif_autre.$selected  = false;
                                      vm.selectedItemJustificatif_autre.$edit      = false;
                                      vm.selectedItemJustificatif_autre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_autre = vm.alljustificatif_autre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_autre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_autre.description = justificatif_autre.description;
                                justificatif_autre.fichier = justificatif_autre.fichier; 

                                justificatif_autre.id  =   String(data.response);              
                                NouvelItemJustificatif_autre=false;
                          }
                            justificatif_autre.$selected = false;
                            justificatif_autre.$edit = false;
                            vm.selectedItemJustificatif_autre = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
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
        

    }
})();
