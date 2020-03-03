(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.validation_demande_deblocage_feffi')
        .controller('Validation_demande_deblocage_feffiController', Validation_demande_deblocage_feffiController)
    /** @ngInject */
    function Validation_demande_deblocage_feffiController($mdDialog, $scope, apiFactory, $state,loginService,apiUrlFile)
    {
		    var vm    = this;
            vm.stepOne   = false;
            vm.stepTwo   = false;
            vm.stepThree   = false;

    //initialisation

        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation_invalide  = [] ; 
        vm.alldemande_realimentation_valide  = [] ;
        vm.allpiece_justificatif_feffi = [] ;
        vm.countDemandeInvalide = 0;
        vm.countDemandeValide = 0;

       // vm.allcurenttranche_deblocage_feffi = [];
        vm.alltranche_deblocage_feffi = [];
        vm.demande_realimentation = [];

        vm.selectedItemPiece_justificatif_feffi = {} ;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        //recuperation donnée tranche deblocage feffi
        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
          vm.alltranche_deblocage_feffi= result.data.response;
         // vm.allcurenttranche_deblocage_feffi = result.data.response;
              //console.log(vm.allcurenttranche_deblocage_feffi);
        });
        

  /*****************Debut StepOne convention_cisco_feffi_entete***************/

  

        apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi_invalide","validation",0).then(function(result)
        {
            vm.alldemande_realimentation_invalide = result.data.response;
            if (vm.alldemande_realimentation_invalide.length>0)
            {
              vm.countDemandeInvalide = vm.alldemande_realimentation_invalide.length
            }
            
        }); 

        //recuperation donnée demande valide
        apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi_valide","validation",1).then(function(result)
        {
            vm.alldemande_realimentation_valide = result.data.response; 
            
            if (vm.alldemande_realimentation_valide.length>0)
            {
              vm.countDemandeValide = vm.alldemande_realimentation_valide.length
            }
        });       

  /*****************Fin StepOne convention_cisco_feffi_entete****************/
  

  /*****************Debut StepTwo demande_realimentation_feffi****************/

      vm.demande_realimentation_invalide_column = [
        {titre:"Numero compte"},        
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Date"},
        {titre:"Action"}];


        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {   vm.stepOne   = true;
            vm.stepTwo   = false;
            vm.selectedItemDemande_realimentation = item;
            apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',item.id).then(function(result)
            {
                vm.allpiece_justificatif_feffi = result.data.response;
            });
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation_invalide) return;
             vm.alldemande_realimentation_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });



        vm.validerDemande_realimentation = function(item)
        {
          validation_in_baseDemande_realimentation(item,0,1);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function validation_in_baseDemande_realimentation(demande_realimentation,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };

            var datas = $.param({
                    supprimer: suppression,
                    id:        vm.selectedItemDemande_realimentation.id,      
                    id_compte_feffi: demande_realimentation.compte_feffi.id ,
                    id_tranche_deblocage_feffi: demande_realimentation.tranche.id ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: validation ,
                    id_convention_cife_entete: vm.selectedItemDemande_realimentation.convention_cife_entete.id              
                });

                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                vm.selectedItemDemande_realimentation.validation = validation;
                        
                vm.alldemande_realimentation_valide.push(vm.selectedItemDemande_realimentation);
                

                vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemDemande_realimentation.id;
                });

                vm.countDemandeValide = vm.alldemande_realimentation_valide.length
                vm.countDemandeInvalide = vm.alldemande_realimentation_invalide.length
                vm.selectedItemDemande_realimentation.$selected  = false;
                vm.selectedItemDemande_realimentation.$edit      = false;
                vm.selectedItemDemande_realimentation ={};

            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepTwo demande_realimentation_feffi****************/

  /*****************Fin StepThree piece_justificatif_feffi****************/

        vm.piece_justificatif_feffi_column = [
        {titre:"Description"},
        {titre:"Fichier"},
        {titre:"Date"},
        {titre:"Action"}];

        //fonction selection item Piece_justificatif_feffi
        vm.selectionPiece_justificatif_feffi= function (item)
        {
            vm.selectedItemPiece_justificatif_feffi = item;
           // vm.allconvention_cisco_feffi_entete= [] ; 
        };
        $scope.$watch('vm.selectedItemPiece_justificatif_feffi', function()
        {
             if (!vm.allpiece_justificatif_feffi) return;
             vm.allpiece_justificatif_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPiece_justificatif_feffi.$selected = true;
        });

        vm.DownloadPiece_justificatif_feffi = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }

  /*****************Fin StepThree piece_justificatif_feffi****************/

  /*****************Debut StepFor transfert_daaf****************/
        vm.demande_realimentation_valide_column = [
            {titre:"Numero compte"},        
            {titre:"Tranche"},
            {titre:"Prévu"},
            {titre:"Cumul"},
            {titre:"Antérieur"},
            {titre:"Periode"},
            {titre:"Pourcentage"},
            {titre:"Reste à décaisser"},
            {titre:"Date"}]

  /*****************Fin StepFor transfert_daaf****************/ 


        //format date affichage sur datatable
        vm.formatDate = function (daty)
        {
          if (daty) 
          {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

        }

        //convertion date au format AAAA-MM-JJ
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }
    }
})();
