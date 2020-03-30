(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.dossier_feffi')
    //.controller('DialogController', DialogController)
        .controller('Dossier_feffiController', Dossier_feffiController);
    /** @ngInject */
    function Dossier_feffiController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemFeffi = {} ;
        vm.allfeffi = [] ;

        vm.selectedItemContrat_feffi = {} ;
        vm.allcontrat_feffi = [] ;
        vm.allregion = [];
        vm.alldistrict = [];
        vm.allcisco = [];       

       // vm.ajoutDossier_feffi = ajoutDossier_feffi;
        //var NouvelItemDossier_feffi=false;
       // var currentItemDossier_feffi;
        vm.selectedItemDossier_feffi = {} ;
        vm.alldossier_feffi = [] ;
        //vm.showbuttonValidation = false;

        //vm.selectedItemDossier_feffi_valide = {} ;
        //vm.alldossier_feffi_valide = [] ;

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

  /**********************************feffi****************************************/
          vm.feffi_column = [
          {titre:"Identifiant"},
          {titre:"Dénomination"},
          {titre:"Nombre feminin"},
          {titre:"Nombre membre"},
          {titre:"Adresse"},
          {titre:"Ecole"},
          {titre:"Observation"}];

        //recuperation donnée feffi
        /*apiFactory.getAll("feffi/index").then(function(result)
        {
            vm.allfeffi = result.data.response; 
            console.log(vm.allfeffi);
        });*/
        /*var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          //vm.allcisco.push(usercisco);
          
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allfeffi = result.data.response; 
                console.log(vm.allfeffi);
            });

            apiFactory.getAPIgeneraliserREST("ecole/index",'menus','getecoleBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allecole = result.data.response; 
                console.log(vm.allecole);
            });
          }
          

        });*/

        apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion= result.data.response;
        });
        vm.filtrer = function(filtre)
        {
          apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiByfiltre','id_cisco',filtre.id_cisco,'id_district',filtre.id_district,'id_region',filtre.id_region).then(function(result)
            {
                vm.allfeffi = result.data.response; 
                console.log(vm.allfeffi);
            });
        }
        vm.change_region = function(filtre)
        {
            apiFactory.getAPIgeneraliserREST("district/index","id_region",filtre.id_region).then(function(result)
            {
                vm.alldistrict = result.data.response; 
                console.log(vm.alldistrict);
            });
        }

        vm.change_district = function(filtre)
        {
            apiFactory.getAPIgeneraliserREST("cisco/index","id_district",filtre.id_district).then(function(result)
            {
                vm.allcisco = result.data.response; 
                console.log(vm.allcisco);
            });
        }

        vm.selectionFeffi= function (item)
        {
            vm.selectedItemFeffi = item;

            if (vm.selectedItemFeffi.id!=0)
            {
              //recuperation donnée membre
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideByfeffi','id_feffi',vm.selectedItemFeffi.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi_entete = result.data.response; 
                  console.log( vm.allconvention_cisco_feffi_entete);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }
            
        };
        $scope.$watch('vm.selectedItemFeffi', function()
        {
             if (!vm.allfeffi) return;
             vm.allfeffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemFeffi.$selected = true;
        });

      /**********************************feffi****************************************/
      
      /*****************debut convention entete***************/

        //col table
        vm.convention_cisco_feffi_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        }];
        //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;
            
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvDetail=true;
            //recuperation donnée convention
           if (vm.selectedItemConvention_cisco_feffi_entete.id!=0)
            {
              
              apiFactory.getAPIgeneraliserREST("dossier_feffi/index",'menu','getdocument_scanByConvention','id_convention_entete',item.id,'validation',1).then(function(result)
              {
                vm.alldossier_feffi = result.data.response;
                 console.log(vm.alldossier_feffi);         
              });

              apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocument_scanByConvention','id_convention_entete',item.id,'validation',1).then(function(result)
              {
                vm.alldossier_prestataire = result.data.response;
                 console.log(vm.alldossier_feffi);         
              });

              apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocument_scanByConvention','id_convention_entete',item.id,'validation',1).then(function(result)
              {
                vm.alldossier_moe = result.data.response;
                 console.log(vm.alldossier_feffi);         
              });

               apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocument_scanByConvention','id_convention_entete',item.id,'validation',1).then(function(result)
              {
                vm.alldossier_pr = result.data.response;
                 console.log(vm.alldossier_feffi);         
              });
            
              //Fin Récupération cout divers par convention
              vm.stepTwo = true;
              vm.stepThree = false;
            };           

        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
             if (!vm.allconvention_cisco_feffi_entete) return;
             vm.allconvention_cisco_feffi_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi_entete.$selected = true;
        });
        /*****************fin convention entete***************/

/**********************************fin contrat feffi****************************************/

        //fonction selection item justificatif batiment
        vm.selectionDossier_feffi= function (item)
        {
            vm.selectedItemDossier_feffi = item;
        };
        $scope.$watch('vm.selectedItemDossier_feffi', function()
        {
             if (!vm.alldossier_feffi) return;
             vm.alldossier_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDossier_feffi.$selected = true;
        });
    
        vm.download_dossier_feffi = function(item)
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
