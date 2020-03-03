(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.validation_demande_paiement_moe_daaf.validation_demande_mobilier_moe_daaf')
        .controller('Validation_demande_mobilier_moe_daafController', Validation_demande_mobilier_moe_daafController);
    /** @ngInject */
    function Validation_demande_mobilier_moe_daafController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

         vm.selectedItemmobilier_construction = {};
        vm.allmobilier_construction  = [];

        vm.selectedItemDemande_mobilier_moe = {};
        vm.alldemande_mobilier_moe = [];

        vm.selectedItemJustificatif_mobilier_moe = {} ;
        vm.alljustificatif_mobilier_moe = [] ;


        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


/**********************************debut demande_mobilier_moe****************************************/
      apiFactory.getAPIgeneraliserREST("demande_mobilier_moe/index",'menu','getdemandeByValidedpfi').then(function(result)
      {
          vm.alldemande_mobilier_moe = result.data.response;
      });

//col table
        vm.demande_mobilier_moe_column = [
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
        {titre:"Action"
        }];

        //fonction selection item Demande_mobilier_moe
        vm.selectionDemande_mobilier_moe= function (item)
        {
            vm.selectedItemDemande_mobilier_moe = item;           
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_mobilier_moe/index",'id_demande_mobilier_moe',vm.selectedItemDemande_mobilier_moe.id).then(function(result)
            {
                vm.alljustificatif_mobilier_moe = result.data.response;
                console.log(vm.alljustificatif_mobilier_moe);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_moe', function()
        {
             if (!vm.alldemande_mobilier_moe) return;
             vm.alldemande_mobilier_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_moe.$selected = true;
        });

        vm.validerDemande_mobilier_moe= function(demande_mobilier_moe,suppression,validation)
        {
            insert_in_baseDemande_mobilier_moe(demande_mobilier_moe,suppression,validation);           
        }
        //insertion ou mise a jours ou suppression item dans bdd Demande_mobilier_moe
        function insert_in_baseDemande_mobilier_moe(demande_mobilier_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_mobilier_moe.id,
                    objet: demande_mobilier_moe.objet,
                    description:demande_mobilier_moe.description,
                    ref_facture:demande_mobilier_moe.ref_facture,
                    id_tranche_demande_mobilier_moe: demande_mobilier_moe.tranche.id ,
                    montant: demande_mobilier_moe.montant,
                    cumul: demande_mobilier_moe.cumul ,
                    anterieur: demande_mobilier_moe.anterieur ,
                    reste: demande_mobilier_moe.reste ,
                    date: convertionDate(new Date(demande_mobilier_moe.date)),
                    id_mobilier_construction: demande_mobilier_moe.mobilier_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_moe/index",datas, config).success(function (data)
            {   

                vm.alldemande_mobilier_moe = vm.alldemande_mobilier_moe.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_mobilier_moe.id;
                });
              demande_mobilier_moe.$selected = false;
              demande_mobilier_moe.$edit = false;
              vm.selectedItemDemande_mobilier_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************fin demande_mobilier_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_mobilier_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];
 

        //fonction selection item justificatif mobilier
        vm.selectionJustificatif_mobilier_moe= function (item)
        {
            vm.selectedItemJustificatif_mobilier_moe = item;             
        };
        $scope.$watch('vm.selectedItemJustificatif_mobilier_moe', function()
        {
             if (!vm.alljustificatif_mobilier_moe) return;
             vm.alljustificatif_mobilier_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_mobilier_moe.$selected = true;
        });
        
        vm.downloadJustificatif_mobilier_moe = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
   
/**********************************fin justificatif mobilier****************************************/



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
