(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere_daaf_feffi')
        .controller('Suivi_financiere_daaf_feffiController', Suivi_financiere_daaf_feffiController);
    /** @ngInject */
    function Suivi_financiere_daaf_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm    = this;
    //initialisation onvention_cisco_feffi_entete;
        vm.selectedItemConvention_cisco_feffi_entete      = {} ;
        vm.allconvention_cisco_feffi_entete  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree          = false;

    //initialisation demande_realimentation_daff
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;

    //initialisation transfert_daaf
        vm.selectedItemTransfert_daaf = {} ;
        vm.alltransfert_daaf  = [] ;     

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        }, function error(response){ alert('something went wrong')});

        vm.filtre_change_region = function(item)
        { vm.filtre.id_cisco = null;
          apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
          {
            vm.ciscos = result.data.response;
            //console.log(vm.ciscos);
          }, function error(result){ alert('something went wrong')});
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
          apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
          {
            vm.communes = result.data.response;
            //console.log(vm.communes);
          }, function error(result){ alert('something went wrong')});
        }
        vm.filtre_change_commune = function(item)
        { vm.filtre.id_ecole = null;
          apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleBycommune","id_commune",item.id_commune).then(function(result)
          {
            vm.ecoles = result.data.response;
            //console.log(vm.ecoles);
          }, function error(result){ alert('something went wrong')});
        }
        vm.resultatfiltrer = function(item)
        {
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
          {
            vm.allconvention_cisco_feffi_entete = result.data.response;
            console.log(vm.allconvention_cisco_feffi_entete );
          }, function error(result){ alert('something went wrong')});
        }
/*****************Debut StepOne convention_cisco_feffi_entete****************/

  //col table
        vm.convention_cisco_feffi_entete_column = [        
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        }];

  //recuperation donnée convention_cisco_feffi_entete
        /*apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideByfeffi','id_feffi',item.id).then(function(result)
        {
            vm.allconvention_cisco_feffi_entete = result.data.response;
            console.log(vm.allconvention_cisco_feffi_entete);
        });*/

        //fonction selection item region
        vm.selectionConvention_cisco_feffi_entete= function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
            console.log(item.id);
            //recuperation donnée demande deblocage
            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandedisponible",'id_convention_cife_entete',item.id).then(function(result)
            {
                vm.alldemande_realimentation = result.data.response; 
                console.log(vm.alldemande_realimentation);
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
            if (!vm.allconvention_cisco_feffi_entete) return;
            vm.allconvention_cisco_feffi_entete.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_cisco_feffi_entete.$selected = true;
        });

  /*****************Fin StepOne convention_cisco_feffi_entete****************/  

  /*****************Debut StepTwo demande_realimentation_daff****************/

      vm.demande_realimentation_column = [
        {titre:"Convention"},
        {titre:"Numero compte"},        
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Date"},
        {titre:"Situation"}];

      

        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            
            //recuperation donnée transfert daaf
            apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'id_demande_deblo_daaf',vm.selectedItemDemande_realimentation.id).then(function(result)
            {
                vm.alltransfert_daaf = result.data.response;                  
            });
            vm.stepTwo = true;
            vm.stepThree = false; 
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation) return;
             vm.alldemande_realimentation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });

  /*****************Fin StepTwo demande_realimentation_daff****************/

  /*****************Fin StepThree transfert_daaf****************/

      vm.transfert_daaf_column = [        
        {titre:"Montant transféré"},        
        {titre:"Frais bancaire"},
        {titre:"Montant total"},
        {titre:"Date"},
        {titre:"Observation"}];

       
        //fonction selection item transfert_daaf
        vm.selectionTransfert_daaf= function (item)
        {
            vm.selectedItemTransfert_daaf = item;
            vm.stepThree          = true;
        };
        $scope.$watch('vm.selectedItemTransfert_daaf', function()
        {
             if (!vm.alltransfert_daaf) return;
             vm.alltransfert_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_daaf.$selected = true;
        });
        
        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Emise au DPFI';                  
                  break;

             case '2':
                  
                  return 'En cours de traitement DPFI'; 
                  break;
              case '3':
                  
                  return 'Rejeté par DPFI'; 
                  break;
              
              case '4':
                        return 'Emise AU DAAF'; 
                  break;
              case '5':    
                  return 'En cours de traitement DAAF'; 
                  break;

              case '6':
                  
                  return 'Rejeté par DPFI'; 
                  break;

              case '7':
                  
                  return 'Finalisée'; 
                  break;

              default: 
          
            }
        }
      
  /*****************Fin StepThree transfert_daaf****************/       

        //convertion date au format AAAA-MM-JJ
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
