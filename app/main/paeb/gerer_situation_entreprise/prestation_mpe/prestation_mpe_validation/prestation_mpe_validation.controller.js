(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.prestation_mpe.prestation_mpe_validation')       
        .controller('Prestation_mpe_validationController', Prestation_mpe_validationController);
    /** @ngInject */
    function Prestation_mpe_validationController($mdDialog, $scope, apiFactory, $state, $cookieStore)
    {
		    var vm = this;

        vm.ajoutPrestation_mpe_validation = ajoutPrestation_mpe_validation ;
        var NouvelItemPrestation_mpe_validation=false;
        var currentItemPrestation_mpe_validation;
        vm.selectedItemPrestation_mpe_validation = {} ;
        vm.allprestation_mpe_validation = [] ;
        vm.showboutonValider = false;
        vm.permissionboutonValider = false;
        vm.showbuttonEnregi = true;

       // vm.showbuttonNouvPassation=true;
        //vm.showThParcourir = false;
        vm.date_now  = new Date();

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
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontrat_prestataireBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allcontrat_prestataire = result.data.response; 
                console.log(vm.allcontrat_prestataire);
            });

            apiFactory.getAPIgeneraliserREST("prestation_mpe/index",'menu','getprestationinvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                  vm.allprestation_mpe_validation = result.data.response;
            });
          }
        });
/**********************************fin contrat prestataire****************************************/       
        //recuperation donnée convention
      /*  apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });*/

        //fonction selection item entete convention cisco/feffi
     /*   vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemContrat_prestataire.id!=0)
            {
              apiFactory.getFils("prestation_mpe_validation/index",vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.allprestation_mpe_validation = result.data.response;

                  if (vm.allprestation_mpe_validation.length!=0)
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
        }); */       

/**********************************fin contrat prestataire****************************************/

/**********************************debut Presation_mpe****************************************/
      vm.change_contrat = function(item)
      { 
        if (item.id==0)
        {
          apiFactory.getAPIgeneraliserREST("prestation_mpe/index",'menu','getprestationBycontrat','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
          {
              vm.allprestation_mpe = result.data.response;
              if (vm.allprestation_mpe.length>0)
              { 
                vm.showAlert('Echec d\'ajout','La prestation exist déjà');
                vm.showbuttonEnregi = false;
              }
          });
        }else
        {
          if (item.id_contrat_prestataire!=currentItemPrestation_mpe_validation.contrat_prestataire.id)
          {
            apiFactory.getAPIgeneraliserREST("prestation_mpe/index",'menu','getprestationBycontrat','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
            {
                vm.allprestation_mpe = result.data.response;
                if (vm.allprestation_mpe.length>0)
                { 
                  vm.showAlert('Echec d\'ajout','La prestation exist déjà');
                  vm.showbuttonEnregi = false;
                }
            });
          }
        }      
        
      }
//col table
        vm.prestation_mpe_validation_column = [
        {titre:"Contrat"
        },
        {titre:"Date prévisionnelle debut travaux"
        },
        {titre:"Date réelle début travaux"
        },
        {titre:"Délai d'exécution"
        },
        {titre:"Date d’expiration de la police d’assurance MPE"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterPrestation_mpe_validation = function ()
        { 
          if (NouvelItemPrestation_mpe_validation == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_contrat_prestataire: '',         
              date_reel_debu_trav: '',
              date_pre_debu_trav: '',
              delai_execution: '',
              date_expiration_assurance_mpe: ''
            };         
            vm.allprestation_mpe_validation.push(items);
            vm.allprestation_mpe_validation.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPrestation_mpe_validation = mem;
              }
            });

            NouvelItemPrestation_mpe_validation = true ;
          }else
          {
            vm.showAlert('Ajout prestation mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPrestation_mpe_validation(prestation_mpe_validation,suppression)
        {
            if (NouvelItemPrestation_mpe_validation==false)
            {
                test_existancePrestation_mpe_validation (prestation_mpe_validation,suppression); 
            } 
            else
            {
                insert_in_basePrestation_mpe_validation(prestation_mpe_validation,suppression);
            }
        }

        //fonction de bouton d'annulation Presation_mpe
        vm.annulerPrestation_mpe_validation = function(item)
        {
          if (NouvelItemPrestation_mpe_validation == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_contrat_prestataire   = currentItemPrestation_mpe_validation.id_contrat_prestataire ;
            item.date_reel_debu_trav   = currentItemPrestation_mpe_validation.date_reel_debu_trav ;
            item.date_pre_debu_trav   = currentItemPrestation_mpe_validation.date_pre_debu_trav ;
            item.delai_execution   = currentItemPrestation_mpe_validation.delai_execution ;
            item.date_expiration_assurance_mpe  = currentItemPrestation_mpe_validation.date_expiration_assurance_mpe;
            
          }else
          {
            vm.allprestation_mpe_validation = vm.allprestation_mpe_validation.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPrestation_mpe_validation.id;
            });
          }
          vm.showboutonValider = false;
          vm.selectedItemPrestation_mpe_validation = {} ;
          NouvelItemPrestation_mpe_validation      = false;
          
        };

        //fonction selection item Prestation_mpe_validation
        vm.selectionPrestation_mpe_validation= function (item)
        {
            vm.selectedItemPrestation_mpe_validation = item;
            vm.nouvelItemPrestation_mpe_validation   = item;
            //console.log(item.$edit);
            if (item.$edit==false || item.$edit==undefined)
            {
                currentItemPrestation_mpe_validation    = JSON.parse(JSON.stringify(vm.selectedItemPrestation_mpe_validation));              
            console.log(currentItemPrestation_mpe_validation);
            }
            
           if(item.id!=0)
           {
            apiFactory.getFils("phase_sous_projet_construction/index",item.id).then(function(result)
            {
                vm.allphase_sous_projet = result.data.response;
                console.log(vm.allphase_sous_projet);
            });

            vm.showboutonValider = true;
           }
             
        };
        $scope.$watch('vm.selectedItemPrestation_mpe_validation', function()
        {
             if (!vm.allprestation_mpe_validation) return;
             vm.allprestation_mpe_validation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPrestation_mpe_validation.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPrestation_mpe_validation = function(item)
        {
            NouvelItemPrestation_mpe_validation = false ;
            vm.selectedItemPrestation_mpe_validation = item;
            currentItemPrestation_mpe_validation = angular.copy(vm.selectedItemPrestation_mpe_validation);
            $scope.vm.allprestation_mpe_validation.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_contrat_prestataire   = vm.selectedItemPrestation_mpe_validation.contrat_prestataire.id ;
            item.date_reel_debu_trav   = new Date(vm.selectedItemPrestation_mpe_validation.date_reel_debu_trav );
            item.date_pre_debu_trav   = new Date(vm.selectedItemPrestation_mpe_validation.date_pre_debu_trav);
            item.delai_execution   = vm.selectedItemPrestation_mpe_validation.delai_execution;
            item.date_expiration_assurance_mpe   = new Date(vm.selectedItemPrestation_mpe_validation.date_expiration_assurance_mpe);
           
        };

        //fonction bouton suppression item Presation_mpe
        vm.supprimerPrestation_mpe_validation = function()
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
                vm.ajoutPrestation_mpe_validation(vm.selectedItemPrestation_mpe_validation,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePrestation_mpe_validation(item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allprestation_mpe_validation.filter(function(obj)
                {
                   return obj.id == currentItemPrestation_mpe_validation.id;
                });
                if(pass[0])
                {
                   if((pass[0].date_reel_debu_trav   != currentItemPrestation_mpe_validation.date_reel_debu_trav )
                    || (pass[0].date_pre_debu_trav   != currentItemPrestation_mpe_validation.date_pre_debu_trav )
                    || (pass[0].delai_execution   != currentItemPrestation_mpe_validation.delai_execution )
                    || (pass[0].date_expiration_assurance_mpe   != currentItemPrestation_mpe_validation.date_expiration_assurance_mpe ) )                   
                      { 
                         insert_in_basePrestation_mpe_validation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePrestation_mpe_validation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Presation_mpe
        function insert_in_basePrestation_mpe_validation(prestation_mpe_validation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPrestation_mpe_validation==false)
            {
                getId = vm.selectedItemPrestation_mpe_validation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_reel_debu_trav:convertionDate(new Date( prestation_mpe_validation.date_reel_debu_trav)),
                    date_pre_debu_trav: convertionDate(new Date(prestation_mpe_validation.date_pre_debu_trav)),
                    delai_execution:prestation_mpe_validation.delai_execution,
                    date_expiration_assurance_mpe: convertionDate(new Date(prestation_mpe_validation.date_expiration_assurance_mpe)),                    
                    id_contrat_prestataire: prestation_mpe_validation.id_contrat_prestataire,
                    validation: 0                                 
                });
                console.log(datas);
                //factory
            apiFactory.add("prestation_mpe/index",datas, config).success(function (data)
            {
                var contrat= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == prestation_mpe_validation.id_contrat_prestataire;
                });

                if (NouvelItemPrestation_mpe_validation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPrestation_mpe_validation.contrat_prestataire   = contrat[0];
                        
                        vm.selectedItemPrestation_mpe_validation.$selected  = false;
                        vm.selectedItemPrestation_mpe_validation.$edit      = false;
                        vm.selectedItemPrestation_mpe_validation ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allprestation_mpe_validation = vm.allprestation_mpe_validation.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPrestation_mpe_validation.id;
                      });
                      vm.showbuttonNouv = true;
                    }
                    
                }
                else
                { 
                  vm.showbuttonNouv = false;
                  prestation_mpe_validation.contrat_prestataire   = contrat[0];
                  prestation_mpe_validation.id  =   String(data.response);              
                  NouvelItemPrestation_mpe_validation=false;
            }
              vm.showboutonValider = false;
              prestation_mpe_validation.$selected = false;
              prestation_mpe_validation.$edit = false;
              vm.selectedItemPrestation_mpe_validation = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

      vm.validationPrestation = function()
      {
        validationPrestation_mpe(vm.selectedItemPrestation_mpe_validation,0,1);
      }

      function validationPrestation_mpe(prestation_mpe_validation,suppression,validation)
      {
          //add
              var config =
              {
                  headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
              };
              
              var datas = $.param({
                      supprimer: suppression,
                      id:        prestation_mpe_validation.id,
                      date_reel_debu_trav:convertionDate(new Date( prestation_mpe_validation.date_reel_debu_trav)),
                      date_pre_debu_trav: convertionDate(new Date(prestation_mpe_validation.date_pre_debu_trav)),
                      delai_execution:prestation_mpe_validation.delai_execution,
                      date_expiration_assurance_mpe: convertionDate(new Date(prestation_mpe_validation.date_expiration_assurance_mpe)),                    
                      id_contrat_prestataire: prestation_mpe_validation.contrat_prestataire.id,
                      validation:validation                                 
                  });
                  console.log(datas);
                  //factory
              apiFactory.add("prestation_mpe/index",datas, config).success(function (data)
              {
                  vm.allprestation_mpe_validation = vm.allprestation_mpe_validation.filter(function(obj)
                  {
                      return obj.id !== vm.selectedItemPrestation_mpe_validation.id;
                  });
                vm.showboutonValider = false;
                vm.selectedItemPrestation_mpe_validation = {};
              
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
      }
/**********************************fin Presation_mpe****************************************/

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

        vm.convertinCkexbox=function(item)
        { var checbox= false;  
          if(item=='1')
            {
                checbox=true;                
            }
          return checbox;     
        }
        

    }
})();
