(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.suivi_financier_pr.suivi_financier_debut_travaux_pr')

        .controller('Suivi_financier_debut_travaux_prController', Suivi_financier_debut_travaux_prController);
    /** @ngInject */
    function Suivi_financier_debut_travaux_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
		   var vm = this;

        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.selectedItemDemande_debut_travaux_pr = {};
        vm.alldemande_debut_travaux_pr = [];

       vm.selectedItemPaiement_debut_travaux_pr = {} ;
        vm.allpaiement_debut_travaux_pr = [] ;

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
        vm.contrat_partenaire_relai_column = [
        {titre:"Partenaire relai"
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
        apiFactory.getAll("contrat_partenaire_relai/index").then(function(result)
        {
            vm.allcontrat_partenaire_relai = result.data.response; 
            console.log(vm.allcontrat_partenaire_relai);
        });

       /* var id_user = $cookieStore.get('id');

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
              apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratBycisco','id_cisco',usercisco.id).then(function(result)
              {
                  vm.allcontrat_partenaire_relai = result.data.response; 
                  console.log(vm.allcontrat_partenaire_relai);
              });
            }
        });*/

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_partenaire_relai = function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("demande_debut_travaux_pr/index",'menu','getdemandedisponibleBycontrat','id_contrat_partenaire_relai',item.id).then(function(result)
              {
                  vm.alldemande_debut_travaux_pr = result.data.response;
                  console.log(vm.alldemande_debut_travaux_pr);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              
            }           

        };
        $scope.$watch('vm.selectedItemContrat_partenaire_relai', function()
        {
             if (!vm.allcontrat_partenaire_relai) return;
             vm.allcontrat_partenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_partenaire_relai.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

      vm.demande_debut_travaux_pr_column = [        
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
        vm.selectionDemande_debut_travaux_pr= function (item)
        {
            vm.selectedItemDemande_debut_travaux_pr = item;
            
           if(item.id!=0)
           {
           apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_pr/index",'id_demande_debut_travaux_pr',vm.selectedItemDemande_debut_travaux_pr.id).then(function(result)
            {
                vm.allpaiement_debut_travaux_pr = result.data.response;
                console.log(vm.allpaiement_debut_travaux_pr);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_debut_travaux_pr', function()
        {
             if (!vm.alldemande_debut_travaux_pr) return;
             vm.alldemande_debut_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_debut_travaux_pr.$selected = true;
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

        vm.paiement_debut_travaux_pr_column = [        
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