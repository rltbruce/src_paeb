(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.validation_demande_paiement_pr_bcaf.validation_demande_fin_travaux_pr_bcaf')

        .controller('Validation_demande_fin_travaux_pr_bcafController', Validation_demande_fin_travaux_pr_bcafController);
    /** @ngInject */
    function Validation_demande_fin_travaux_pr_bcafController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemDemande_fin_travaux_pr = {};
        vm.alldemande_fin_travaux_pr = [];

        vm.selectedItemJustificatif_fin_travaux_pr = {} ;
        vm.alljustificatif_fin_travaux_pr = [] ;

       

        vm.allcurenttranche_d_fin_travaux_pr = [];
        vm.alltranche_d_fin_travaux_pr = [];
        vm.dernierdemande = [];

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


/**********************************fin demande_fin_travaux_pr****************************************/
//col table
        vm.demande_fin_travaux_pr_column = [
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
    
    apiFactory.getAPIgeneraliserREST("demande_fin_travaux_pr/index",'menu','getdemandeByInvalide').then(function(result)
    {
        vm.alldemande_fin_travaux_pr = result.data.response;
                  console.log(vm.alldemande_fin_travaux_pr);
    });

        //fonction selection item Demande_fin_travaux_pr
        vm.selectionDemande_fin_travaux_pr= function (item)
        {
            vm.selectedItemDemande_fin_travaux_pr = item;
           
           if(item.id!=0)
           {
           apiFactory.getAPIgeneraliserREST("justificatif_fin_travaux_pr/index",'id_demande_fin_travaux_pr',vm.selectedItemDemande_fin_travaux_pr.id).then(function(result)
            {
                vm.alljustificatif_fin_travaux_pr = result.data.response;
                console.log(vm.alljustificatif_fin_travaux_pr);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_fin_travaux_pr', function()
        {
             if (!vm.alldemande_fin_travaux_pr) return;
             vm.alldemande_fin_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_fin_travaux_pr.$selected = true;
        });

        vm.validerDemande_fin_travaux_pr= function(demande_fin_travaux_pr,suppression,validation)
        {
            insert_in_baseDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression,validation);           
        }     

        //insertion ou mise a jours ou suppression item dans bdd Demande_fin_travaux_pr
        function insert_in_baseDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_fin_travaux_pr.id,
                    objet: demande_fin_travaux_pr.objet,
                    description:demande_fin_travaux_pr.description,
                    ref_facture:demande_fin_travaux_pr.ref_facture,
                    id_tranche_d_fin_travaux_pr: demande_fin_travaux_pr.tranche.id ,
                    montant: demande_fin_travaux_pr.montant,
                    cumul: demande_fin_travaux_pr.cumul ,
                    anterieur: demande_fin_travaux_pr.anterieur ,
                    reste: demande_fin_travaux_pr.reste ,
                    date: convertionDate(new Date(demande_fin_travaux_pr.date)),
                    id_contrat_bureau_etude: demande_fin_travaux_pr.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_fin_travaux_pr/index",datas, config).success(function (data)
            {   

                vm.alldemande_fin_travaux_pr = vm.alldemande_fin_travaux_pr.filter(function(obj)
                {
                    return obj.id != vm.selectedItemDemande_fin_travaux_pr.id;
                });
              demande_fin_travaux_pr.$selected = false;
              demande_fin_travaux_pr.$edit = false;
              vm.selectedItemDemande_fin_travaux_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

       
/**********************************fin demande_fin_travaux_pr****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_fin_travaux_pr_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

     

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_fin_travaux_pr= function (item)
        {
            vm.selectedItemJustificatif_fin_travaux_pr = item;           
        };
        $scope.$watch('vm.selectedItemJustificatif_fin_travaux_pr', function()
        {
             if (!vm.alljustificatif_fin_travaux_pr) return;
             vm.alljustificatif_fin_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_fin_travaux_pr.$selected = true;
        });
        vm.downloadJustificatif_fin_travaux_pr = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
     
/**********************************fin justificatif batiment****************************************/



/**********************************fin pr_sousmissionnaire****************************************/
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
    function showDialog($event,items) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '<md-subheader style="background-color: rgb(245,245,245)">'+
            '<h3 mat-dialog-title  style="margin:0px; color: red;">Erreur de suppression de fichier</h3>'+
          '</md-subheader>'+
           '  <md-dialog-content>'+
           '    <p>Veuillez communiquer ce réference à l\'administrateur</p>'+
           '    <p>Réference: {{items}}</p>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Fermer' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: items
         },
         controller: DialogController
      });

    }

      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }  

    }
})();
