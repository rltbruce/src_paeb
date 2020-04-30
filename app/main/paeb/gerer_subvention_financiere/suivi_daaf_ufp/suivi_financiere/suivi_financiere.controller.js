(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere')
        .controller('Suivi_financiereController', Suivi_financiereController);
    /** @ngInject */
    function Suivi_financiereController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm    = this;
    //initialisation onvention_ufp_daaf_entete;
        vm.selectedItemConvention_ufp_daaf_entete      = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree          = false;

    //initialisation demande_deblocage_daff
        vm.selectedItemDemande_deblocage = {} ;
        vm.alldemande_deblocage  = [] ;

    //initialisation transfert_ufp
        vm.selectedItemTransfert_ufp = {} ;
        vm.alltransfert_ufp  = [] ;     

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
/*****************Debut StepOne convention_ufp_daaf_entete****************/

  //col table
        vm.convention_ufp_daaf_entete_column = [
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Montant convention"}
        ];

  //recuperation donnée convention_ufp_daaf_entete
        apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
            console.log(vm.allconvention_ufp_daaf_entete);
        });

        //fonction selection item region
        vm.selectionConvention_ufp_daaf_entete= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
            
            //recuperation donnée demande deblocage
            apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index",'menu','getdemandedisponible','id_convention_ufp_daaf_entete',item.id).then(function(result)
            {
                vm.alldemande_deblocage = result.data.response;                  
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_entete', function()
        {
            if (!vm.allconvention_ufp_daaf_entete) return;
            vm.allconvention_ufp_daaf_entete.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_ufp_daaf_entete.$selected = true;
        });

  /*****************Fin StepOne convention_ufp_daaf_entete****************/  

  /*****************Debut StepTwo demande_deblocage_daff****************/

      vm.demande_deblocage_column = [
        {titre:"Réference convention"},
        {titre:"Réference demande"},
        {titre:"Objet"},       
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Situation"}];

      

        //fonction selection item region
        vm.selectionDemande_deblocage= function (item)
        {
            vm.selectedItemDemande_deblocage = item;
            
            //recuperation donnée transfert ufp
            apiFactory.getAPIgeneraliserREST("transfert_ufp/index",'id_demande_deblo_daaf',vm.selectedItemDemande_deblocage.id).then(function(result)
            {
                vm.alltransfert_ufp = result.data.response;                  
            });
            vm.stepTwo = true;
            vm.stepThree = false; 
        };
        $scope.$watch('vm.selectedItemDemande_deblocage', function()
        {
             if (!vm.alldemande_deblocage) return;
             vm.alldemande_deblocage.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage.$selected = true;
        });

        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Emise';                  
                  break;
              
              case '2':
                        return 'En cours de traitement'; 
                  break;

              case '3':
                  
                  return 'Finalisée'; 
                  break;

             case '4':
                  
                  return 'Rejeté'; 
                  break;

              default: 
          
            }
        }
  /*****************Fin StepTwo demande_deblocage_daff****************/

  /*****************Fin StepThree transfert_ufp****************/

      vm.transfert_ufp_column = [        
        {titre:"Montant transféré"},        
        {titre:"Frais bancaire"},
        {titre:"Montant total"},
        {titre:"Date"},
        {titre:"Observation"}];

       
        //fonction selection item transfert_ufp
        vm.selectionTransfert_ufp= function (item)
        {
            vm.selectedItemTransfert_ufp = item;
            vm.stepThree          = true;
        };
        $scope.$watch('vm.selectedItemTransfert_ufp', function()
        {
             if (!vm.alltransfert_ufp) return;
             vm.alltransfert_ufp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_ufp.$selected = true;
        });

      
  /*****************Fin StepThree transfert_ufp****************/       

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

        //format date affichage sur datatable
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
