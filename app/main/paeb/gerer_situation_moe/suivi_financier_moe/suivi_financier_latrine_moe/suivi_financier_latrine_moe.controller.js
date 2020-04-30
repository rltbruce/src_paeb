(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.suivi_financier_moe.suivi_financier_latrine_moe')

        .controller('Suivi_financier_latrine_moeController', Suivi_financier_latrine_moeController);
    /** @ngInject */
    function Suivi_financier_latrine_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
       var vm = this;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;

        vm.selectedItemDemande_latrine_moe = {};
        vm.alldemande_latrine_moe = [];

       vm.selectedItemPaiement_latrine_moe = {} ;
        vm.allpaiement_latrine_moe = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

 
/**********************************fin contrat prestataire****************************************/
        //col table
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
        //recuperation donnée convention
        /*apiFactory.getAll("contrat_bureau_etude/index").then(function(result)
        {
            vm.allcontrat_bureau_etude = result.data.response; 
            console.log(vm.allcontrat_bureau_etude);
        });*/

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
            }
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_bureau_etude = function (item)
        {
            vm.selectedItemContrat_bureau_etude = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index",'menu','getdemandedisponibleBycontrat','id_contrat_bureau_etude',item.id).then(function(result)
              {
                  vm.alldemande_latrine_moe = result.data.response;
                  console.log(vm.alldemande_latrine_moe);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              
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

/**********************************fin contrat prestataire****************************************/

      vm.demande_latrine_moe_column = [        
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Situation"
        }];
        vm.selectionDemande_latrine_moe= function (item)
        {
            vm.selectedItemDemande_latrine_moe = item;
            
           if(item.id!=0)
           {
           apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
            {
                vm.allpaiement_latrine_moe = result.data.response;
                console.log(vm.allpaiement_latrine_moe);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_latrine_moe', function()
        {
             if (!vm.alldemande_latrine_moe) return;
             vm.alldemande_latrine_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_moe.$selected = true;
        });

        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Emise au DPFI';                  
                  break;
              
              case '2':
                        return 'Emise AU DAAF'; 
                  break;

              case '3':
                  
                  return 'Finalisée'; 
                  break;

              default: 
          
            }
        }

        vm.paiement_latrine_moe_column = [        
        {titre:"Montant"},
        {titre:"Date paiement"},
        {titre:"Observation"}];
/**********************************fin rapport avancement mobilier****************************************/


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