(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_gfpc.module_gfpc_valide')
        .controller('Module_gfpc_valideController', Module_gfpc_valideController);
    /** @ngInject */
    function Module_gfpc_valideController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		   var vm = this;

        //vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;


        vm.selectedItemModule_gfpc = {} ;
        vm.allmodule_gfpc = [] ;

        vm.allclassification_site =[];


        vm.selectedItemParticipant_gfpc = {} ;
        vm.allparticipant_gfpc = [] ;

        vm.allsituation_participant_gfpc = [] ;

        vm.selectedItemRapport_gfpc = {} ;
        vm.allrapport_gfpc = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;

        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut passation_marches_moe****************************************/



  apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodule_gfpcByDate').then(function(result)
  {
      vm.allmodule_gfpc = result.data.response;
      
      console.log(vm.allmodule_gfpc);

      /*if (result.data.response.length!=0)
      {
          vm.showbuttonNouvPassation=false;
      }*/
  });
//col table
        vm.module_gfpc_column = [
        {titre:"Contrat"
        },
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_gfpc"
        },
        {titre:"Nombre de participant_gfpc"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];


        apiFactory.getAll("situation_participant_gfpc/index").then(function(result)
        {
            vm.allsituation_participant_gfpc = result.data.response; 
                  console.log( vm.allsituation_participant_gfpc);
        });        
        //Masque de saisi ajout
      

        //fonction selection item region
        vm.selectionModule_gfpc= function (item)
        {
            vm.selectedItemModule_gfpc = item;
            vm.showbuttonNouvRapport =true;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_gfpc/index",'id_module_gfpc',vm.selectedItemModule_gfpc.id).then(function(result)
              {
                  vm.allparticipant_gfpc = result.data.response; 
                  console.log( vm.allparticipant_gfpc);
              });
              vm.showbuttonValider = true;
              apiFactory.getAPIgeneraliserREST("rapport_gfpc/index",'id_module_gfpc',vm.selectedItemModule_gfpc.id).then(function(result)
              {
                  vm.allrapport_gfpc = result.data.response; 
                  if (vm.allrapport_gfpc.length>0)
                  {
                    vm.showbuttonNouvRapport =false;
                  }
              });


              vm.stepOne = true;
              vm.stepTwo = false;
            }
        };
        $scope.$watch('vm.selectedItemModule_gfpc', function()
        {
             if (!vm.allmodule_gfpc) return;
             vm.allmodule_gfpc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_gfpc.$selected = true;
        });

      
/**********************************fin passation_marches_moe****************************************/

/**********************************debut participant_gfpc****************************************/
//col table
        vm.participant_gfpc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

       

        //fonction selection item region
        vm.selectionParticipant_gfpc= function (item)
        {
            vm.selectedItemParticipant_gfpc = item; 
        };
        $scope.$watch('vm.selectedItemParticipant_gfpc', function()
        {
             if (!vm.allparticipant_gfpc) return;
             vm.allparticipant_gfpc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_gfpc.$selected = true;
        });

    

        /**********************************debut compte****************************************/
/**********************************fin justificatif attachement****************************************/

//col table
        vm.rapport_gfpc_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        }];

    

        //fonction selection item justificatif batiment
        vm.selectionRapport_gfpc= function (item)
        {
            vm.selectedItemRapport_gfpc = item; 
        };
        $scope.$watch('vm.selectedItemRapport_gfpc', function()
        {
             if (!vm.allrapport_gfpc) return;
             vm.allrapport_gfpc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_gfpc.$selected = true;
        });

     /**********************************fin justificatif batiment****************************************/

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

        vm.affichage_sexe= function (sexe)
        { var affiche='';
          switch (sexe)
          {
            case '1':
                affiche= 'Masculin';
                break;
            case '2':
                affiche= 'Feminin';
                break;
            default:
          }
          return affiche;
        };
        

    }
})();
