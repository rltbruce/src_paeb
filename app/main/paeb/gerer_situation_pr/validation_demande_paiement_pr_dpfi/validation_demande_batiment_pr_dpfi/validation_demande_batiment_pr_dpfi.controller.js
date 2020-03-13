(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.validation_demande_paiement_pr_dpfi.validation_demande_batiment_pr_dpfi')
        .controller('Validation_demande_batiment_pr_dpfiController', Validation_demande_batiment_pr_dpfiController);
    /** @ngInject */
    function Validation_demande_batiment_pr_dpfiController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.selectedItemDemande_batiment_pr = {};
        vm.alldemande_batiment_pr = [];

        vm.selectedItemJustificatif_batiment_pr = {} ;
        vm.alljustificatif_batiment_pr = [] ;

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


/**********************************debut demande_batiment_pr****************************************/

      apiFactory.getAPIgeneraliserREST("demande_batiment_pr/index",'menu','getdemandeByValidebcaf').then(function(result)
      {
          vm.alldemande_batiment_pr = result.data.response;
      });
//col table
        vm.demande_batiment_pr_column = [
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
   

        //fonction selection item Demande_batiment_pr
        vm.selectionDemande_batiment_pr= function (item)
        {
            vm.selectedItemDemande_batiment_pr = item;
            //vm.nouvelItemDemande_batiment_pr   = item;
            //currentItemDemande_batiment_pr    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_pr));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_pr/index",'id_demande_batiment_pr',vm.selectedItemDemande_batiment_pr.id).then(function(result)
            {
                vm.alljustificatif_batiment_pr = result.data.response;
                console.log(vm.alljustificatif_batiment_pr);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_pr', function()
        {
             if (!vm.alldemande_batiment_pr) return;
             vm.alldemande_batiment_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_pr.$selected = true;
        });

        vm.validerDemande_batiment_pr= function(demande_batiment_pr,suppression,validation)
        {
            insert_in_baseDemande_batiment_pr(demande_batiment_pr,suppression,validation);
           
        }
  

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_pr
        function insert_in_baseDemande_batiment_pr(demande_batiment_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_pr.id,
                    objet: demande_batiment_pr.objet,
                    description:demande_batiment_pr.description,
                    ref_facture:demande_batiment_pr.ref_facture,
                    id_tranche_demande_batiment_pr: demande_batiment_pr.tranche.id ,
                    montant: demande_batiment_pr.montant,
                    cumul: demande_batiment_pr.cumul ,
                    anterieur: demande_batiment_pr.anterieur ,
                    reste: demande_batiment_pr.reste ,
                    date: convertionDate(new Date(demande_batiment_pr.date)),
                    id_batiment_construction: demande_batiment_pr.batiment_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_batiment_pr = vm.alldemande_batiment_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_batiment_pr.id;
                });
              demande_batiment_pr.$selected = false;
              demande_batiment_pr.$edit = false;
              vm.selectedItemDemande_batiment_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_pr_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_batiment_pr= function (item)
        {
            vm.selectedItemJustificatif_batiment_pr = item;            
        };
        $scope.$watch('vm.selectedItemJustificatif_batiment_pr', function()
        {
             if (!vm.alljustificatif_batiment_pr) return;
             vm.alljustificatif_batiment_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_batiment_pr.$selected = true;
        });
        vm.downloadJustificatif_batiment_pr = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }  

/**********************************fin justificatif batiment****************************************/



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
