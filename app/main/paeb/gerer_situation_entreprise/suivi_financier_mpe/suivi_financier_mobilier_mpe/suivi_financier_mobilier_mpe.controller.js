(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_financier_mpe.suivi_financier_mobilier_mpe')

        .controller('Suivi_financier_mobilier_mpeController', Suivi_financier_mobilier_mpeController);
    /** @ngInject */
    function Suivi_financier_mobilier_mpeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
		   var vm = this;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.selectedItemDemande_mobilier_prestataire = {};
        vm.alldemande_mobilier_prestataire = [];

        vm.selectedItemPaiement_mobilier_prestataire = {} ;
        vm.allpaiement_mobilier_prestataire = [] ;

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
        vm.contrat_prestataire_column = [
        {titre:"Prestataire"
        },
        {titre:"Description"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        },
        {titre:"Date prévisionnelle"
        },
        {titre:"Date réel"
        },
        {titre:"Délai éxecution"
        }];     
        //recuperation donnée convention
        /*apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
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
              apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontrat_prestataireBycisco','id_cisco',usercisco.id).then(function(result)
              {
                  vm.allcontrat_prestataire = result.data.response; 
                  console.log(vm.allcontrat_prestataire);
              });
            }
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index",'menu','getdemandedisponibleBycontrat','id_contrat_prestataire',item.id).then(function(result)
              {
                  vm.alldemande_mobilier_prestataire = result.data.response;
                  console.log(vm.alldemande_mobilier_prestataire);
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

      vm.demande_mobilier_prestataire_column = [
        {titre:"Date approbation"
        },
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
        vm.selectionDemande_mobilier_prestataire= function (item)
        {
            vm.selectedItemDemande_mobilier_prestataire = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'id_demande_mobilier_pre',item.id).then(function(result)
            {
                vm.allpaiement_mobilier_prestataire = result.data.response;
                console.log(vm.allpaiement_mobilier_prestataire);
            });

            vm.stepTwo = true;
            vm.stepThree = false;

           }
            console.log(vm.selectedItemDemande_mobilier_prestataire) ;
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_prestataire', function()
        {
             if (!vm.alldemande_mobilier_prestataire) return;
             vm.alldemande_mobilier_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_prestataire.$selected = true;
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

        vm.paiement_mobilier_prestataire_column = [        
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