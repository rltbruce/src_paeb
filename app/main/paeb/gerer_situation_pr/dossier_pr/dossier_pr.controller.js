(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.dossier_pr')
    //.controller('DialogController', DialogController)
        .controller('Dossier_prController', Dossier_prController);
    /** @ngInject */
    function Dossier_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;        

       // vm.ajoutDossier_pr = ajoutDossier_pr;
        //var NouvelItemDossier_pr=false;
       // var currentItemDossier_pr;
        vm.selectedItemDossier_pr = {} ;
        vm.alldossier_pr = [] ;
        //vm.showbuttonValidation = false;

        //vm.selectedItemDossier_pr_valide = {} ;
        //vm.alldossier_pr_valide = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
      /**********************************contrat pr****************************************/

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
      
      apiFactory.getAll("contrat_partenaire_relai/index").then(function(result)
      {
          vm.allcontrat_partenaire_relai = result.data.response; 
          console.log(vm.allcontrat_partenaire_relai);
      });
         //fonction selection item contrat
        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;

           if(item.id!=0)
           {
              vm.stepOne = true;
              vm.stepTwo = false;
              apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocument_scanByContrat','id_contrat_partenaire_relai',item.id).then(function(result)
              {
                vm.alldossier_pr = result.data.response;
                 console.log(vm.alldossier_pr); 
                 console.log(item.id);         
              });
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

/**********************************fin contrat pr****************************************/

        //fonction selection item justificatif batiment
        vm.selectionDossier_pr= function (item)
        {
            vm.selectedItemDossier_pr = item;
        };
        $scope.$watch('vm.selectedItemDossier_pr', function()
        {
             if (!vm.alldossier_pr) return;
             vm.alldossier_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDossier_pr.$selected = true;
        });
    
        vm.download_dossier_pr = function(item)
        {
            
            if (item.fichier !=null){
              window.location = apiUrlFile+item.fichier;
            }
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
