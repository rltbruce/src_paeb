(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.validation_financiere_deblocage_feffi')
        .controller('Validation_financiere_deblocage_feffiController', Validation_financiere_deblocage_feffiController)
    /** @ngInject */
    function Validation_financiere_deblocage_feffiController($mdDialog, $scope, apiFactory, $state,loginService,apiUrlFile)
    {
		    var vm    = this;       

    //initialisation

        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation_invalide  = [] ; 
        
        vm.selectedItemDemande_realimentation_encours = {} ;
        vm.alldemande_realimentation_encours  = [] ; 
        
       // vm.countDemandeInvalide = 0;
       // vm.countDemandeValide = 0;

       // vm.allcurenttranche_deblocage_feffi = [];
        //vm.alltranche_deblocage_feffi = [];
        //vm.demande_realimentation = [];
        vm.date_now = new Date(); 
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

  

        apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi_invalide","validation",2).then(function(result)
        {
            vm.alldemande_realimentation_invalide = result.data.response;
           /* if (vm.alldemande_realimentation_invalide.length>0)
            {
              vm.countDemandeInvalide = vm.alldemande_realimentation_invalide.length
            }*/
            
        }); 

        //recuperation donnée demande valide
        apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi_invalide","validation",5).then(function(result)
        {
            vm.alldemande_realimentation_encours = result.data.response; 
            
           /* if (vm.alldemande_realimentation_valide.length>0)
            {
              vm.countDemandeValide = vm.alldemande_realimentation_valide.length
            }*/
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
        {   
            vm.selectedItemDemande_realimentation = item;
            vm.traiter = false;
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



        vm.validerEncoursDemande_realimentation = function(item)
        {
          validation_in_baseDemande_realimentation(item,0,5);
        }

        vm.validerRejeterDemande_realimentation_encours = function(item)
        {   vm.traiter = true;
          validation_in_baseDemande_realimentation_encours(item,0,6);
        }

        vm.validerFinaliserDemande_realimentation_encours = function(item)
        { vm.traiter = true;
          validation_in_baseDemande_realimentation_encours(item,0,3);
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
                    id:        demande_realimentation.id,      
                    id_compte_feffi: demande_realimentation.compte_feffi.id ,
                    id_tranche_deblocage_feffi: demande_realimentation.tranche.id ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: validation ,
                    id_convention_cife_entete: demande_realimentation.convention_cife_entete.id,
                    date_approbation: convertionDate(new Date(vm.date_now)) ,              
                });

                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                 //vm.selectedItemDemande_realimentation.validation = validation;
                if(vm.traiter ==false)
                {
                    vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                    {
                        return obj.id !== demande_realimentation.id;
                    });
                    vm.alldemande_realimentation_encours.push(demande_realimentation);
                }
                else
                {
                    vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                    {
                        return obj.id !== demande_realimentation.id;
                    });
                }
                

            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }



  /*****************Fin StepTwo demande_realimentation_feffi****************/

  /*****************Debut StepFor transfert_daaf****************/
        vm.demande_realimentation_encours_column = [
            {titre:"Numero compte"},        
            {titre:"Tranche"},
            {titre:"Prévu"},
            {titre:"Cumul"},
            {titre:"Antérieur"},
            {titre:"Periode"},
            {titre:"Pourcentage"},
            {titre:"Reste à décaisser"},
            {titre:"Date"},
            {titre:"Date Approbation"},
            {titre:"Action"}];

            //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function validation_in_baseDemande_realimentation_encours(demande_realimentation,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };

            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_realimentation.id,      
                    id_compte_feffi: demande_realimentation.compte_feffi.id ,
                    id_tranche_deblocage_feffi: demande_realimentation.tranche.id ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: validation ,
                    id_convention_cife_entete: demande_realimentation.convention_cife_entete.id,
                    date_approbation: convertionDate(new Date(vm.date_now))              
                });

                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                    vm.alldemande_realimentation_encours = vm.alldemande_realimentation_encours.filter(function(obj)
                    {
                        return obj.id !== demande_realimentation.id;
                    });
           
                
                //vm.countDemandeValide = vm.alldemande_realimentation_encours.length
                //vm.countDemandeInvalide = vm.alldemande_realimentation_invalide.length
                vm.selectedItemDemande_realimentation_encours.$selected  = false;
                vm.selectedItemDemande_realimentation_encours ={};


            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }



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