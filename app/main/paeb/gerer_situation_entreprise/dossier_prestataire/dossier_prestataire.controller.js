(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.dossier_prestataire')
    //.controller('DialogController', DialogController)
        .controller('Dossier_prestataireController', Dossier_prestataireController);
    /** @ngInject */
    function Dossier_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;        

       // vm.ajoutDossier_prestataire = ajoutDossier_prestataire;
        //var NouvelItemDossier_prestataire=false;
       // var currentItemDossier_prestataire;
        vm.selectedItemDossier_prestataire = {} ;
        vm.alldossier_prestataire = [] ;
        //vm.showbuttonValidation = false;

        //vm.selectedItemDossier_prestataire_valide = {} ;
        //vm.alldossier_prestataire_valide = [] ;

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

       vm.contrat_prestataire_column = [
        {titre:"Numero contrat"
        },
        {titre:"Description"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];
      
      apiFactory.getAll("contrat_prestataire/index").then(function(result)
      {
          vm.allcontrat_prestataire = result.data.response; 
          console.log(vm.allcontrat_prestataire);
      });
         //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;

           if(item.id!=0)
           {
              vm.stepOne = true;
              vm.stepTwo = false;
              apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocument_scanByContrat','id_contrat_prestataire',item.id).then(function(result)
              {
                vm.alldossier_prestataire = result.data.response;
                 console.log(vm.alldossier_prestataire);         
              });
            }
             
        };
        $scope.$watch('vm.selectedItemContrat_prestataire', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allcontrat_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_prestataire.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

        //fonction selection item justificatif batiment
        vm.selectionDossier_prestataire= function (item)
        {
            vm.selectedItemDossier_prestataire = item;
        };
        $scope.$watch('vm.selectedItemDossier_prestataire', function()
        {
             if (!vm.alldossier_prestataire) return;
             vm.alldossier_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDossier_prestataire.$selected = true;
        });
    
        vm.download_dossier_prestataire = function(item)
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
