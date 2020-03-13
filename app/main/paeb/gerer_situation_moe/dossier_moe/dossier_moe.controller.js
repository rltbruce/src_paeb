(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.dossier_moe')
    //.controller('DialogController', DialogController)
        .controller('Dossier_moeController', Dossier_moeController);
    /** @ngInject */
    function Dossier_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;        

       // vm.ajoutDossier_moe = ajoutDossier_moe;
        //var NouvelItemDossier_moe=false;
       // var currentItemDossier_moe;
        vm.selectedItemDossier_moe = {} ;
        vm.alldossier_moe = [] ;
        //vm.showbuttonValidation = false;

        //vm.selectedItemDossier_moe_valide = {} ;
        //vm.alldossier_moe_valide = [] ;

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
      /**********************************contrat prestataire****************************************/

       vm.contrat_bureau_etude_column = [
        {titre:"Bureau d'etude"
        },
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        }];
      
      apiFactory.getAll("contrat_be/index").then(function(result)
      {
          vm.allcontrat_bureau_etude = result.data.response; 
          console.log(vm.allcontrat_bureau_etude);
      });
         //fonction selection item contrat
        vm.selectionContrat_bureau_etude= function (item)
        {
            vm.selectedItemContrat_bureau_etude = item;

           if(item.id!=0)
           {
              vm.stepOne = true;
              vm.stepTwo = false;
              apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocument_scanByContrat','id_contrat_bureau_etude',item.id).then(function(result)
              {
                vm.alldossier_moe = result.data.response;
                 console.log(vm.alldossier_moe);         
              });
            }
             
        };
        $scope.$watch('vm.selectedItemContrat_bureau_etude', function()
        {
             if (!vm.allcontrat_bureau_etude) return;
             vm.allcontrat_bureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_bureau_etude.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

        //fonction selection item justificatif batiment
        vm.selectionDossier_moe= function (item)
        {
            vm.selectedItemDossier_moe = item;
        };
        $scope.$watch('vm.selectedItemDossier_moe', function()
        {
             if (!vm.alldossier_moe) return;
             vm.alldossier_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDossier_moe.$selected = true;
        });
    
        vm.download_dossier_moe = function(item)
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
