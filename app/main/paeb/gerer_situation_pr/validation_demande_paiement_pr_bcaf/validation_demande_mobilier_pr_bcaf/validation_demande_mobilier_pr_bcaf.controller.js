(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.validation_demande_paiement_pr_bcaf.validation_demande_mobilier_pr_bcaf')
        .controller('Validation_demande_mobilier_pr_bcafController', Validation_demande_mobilier_pr_bcafController);
    /** @ngInject */
    function Validation_demande_mobilier_pr_bcafController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

         vm.selectedItemmobilier_construction = {};
        vm.allmobilier_construction  = [];

        vm.selectedItemDemande_mobilier_pr = {};
        vm.alldemande_mobilier_pr = [];

        vm.selectedItemJustificatif_mobilier_pr = {} ;
        vm.alljustificatif_mobilier_pr = [] ;


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


/**********************************debut demande_mobilier_pr****************************************/
      apiFactory.getAPIgeneraliserREST("demande_mobilier_pr/index",'menu','getdemandeByInvalide').then(function(result)
      {
          vm.alldemande_mobilier_pr = result.data.response;
      });

//col table
        vm.demande_mobilier_pr_column = [
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

        //fonction selection item Demande_mobilier_pr
        vm.selectionDemande_mobilier_pr= function (item)
        {
            vm.selectedItemDemande_mobilier_pr = item;           
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_mobilier_pr/index",'id_demande_mobilier_pr',vm.selectedItemDemande_mobilier_pr.id).then(function(result)
            {
                vm.alljustificatif_mobilier_pr = result.data.response;
                console.log(vm.alljustificatif_mobilier_pr);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_pr', function()
        {
             if (!vm.alldemande_mobilier_pr) return;
             vm.alldemande_mobilier_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_pr.$selected = true;
        });

        vm.validerDemande_mobilier_pr= function(demande_mobilier_pr,suppression,validation)
        {
            insert_in_baseDemande_mobilier_pr(demande_mobilier_pr,suppression,validation);           
        }
        //insertion ou mise a jours ou suppression item dans bdd Demande_mobilier_pr
        function insert_in_baseDemande_mobilier_pr(demande_mobilier_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_mobilier_pr.id,
                    objet: demande_mobilier_pr.objet,
                    description:demande_mobilier_pr.description,
                    ref_facture:demande_mobilier_pr.ref_facture,
                    id_tranche_demande_mobilier_pr: demande_mobilier_pr.tranche.id ,
                    montant: demande_mobilier_pr.montant,
                    cumul: demande_mobilier_pr.cumul ,
                    anterieur: demande_mobilier_pr.anterieur ,
                    reste: demande_mobilier_pr.reste ,
                    date: convertionDate(new Date(demande_mobilier_pr.date)),
                    id_mobilier_construction: demande_mobilier_pr.mobilier_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_mobilier_pr = vm.alldemande_mobilier_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_mobilier_pr.id;
                });
              demande_mobilier_pr.$selected = false;
              demande_mobilier_pr.$edit = false;
              vm.selectedItemDemande_mobilier_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************fin demande_mobilier_pr****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_mobilier_pr_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];
 

        //fonction selection item justificatif mobilier
        vm.selectionJustificatif_mobilier_pr= function (item)
        {
            vm.selectedItemJustificatif_mobilier_pr = item;             
        };
        $scope.$watch('vm.selectedItemJustificatif_mobilier_pr', function()
        {
             if (!vm.alljustificatif_mobilier_pr) return;
             vm.alljustificatif_mobilier_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_mobilier_pr.$selected = true;
        });
        
        vm.downloadJustificatif_mobilier_pr = function(item)
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
