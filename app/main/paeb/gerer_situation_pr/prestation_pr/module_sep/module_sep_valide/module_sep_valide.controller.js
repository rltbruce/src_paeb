(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_sep.module_sep_valide')
        .controller('Module_sep_valideController', Module_sep_valideController);
    /** @ngInject */
    function Module_sep_valideController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		   var vm = this;

        //vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;


        vm.selectedItemModule_sep = {} ;
        vm.allmodule_sep = [] ;

        vm.allclassification_site =[];


        vm.selectedItemParticipant_sep = {} ;
        vm.allparticipant_sep = [] ;

        vm.allsituation_participant_sep = [] ;

        vm.selectedItemRapport_sep = {} ;
        vm.allrapport_sep = [] ;

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



  apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodule_sepByDate').then(function(result)
  {
      vm.allmodule_sep = result.data.response;
      
      console.log(vm.allmodule_sep);

      if (result.data.response.length!=0)
      {
          vm.showbuttonNouvPassation=false;
      }
  });
//col table
        vm.module_sep_column = [
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
        {titre:"Nombre prévisionnel participant_sep"
        },
        {titre:"Nombre de participant_sep"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];


        apiFactory.getAll("situation_participant_sep/index").then(function(result)
        {
            vm.allsituation_participant_sep = result.data.response; 
                  console.log( vm.allsituation_participant_sep);
        });        
        //Masque de saisi ajout
      

        //fonction selection item region
        vm.selectionModule_sep= function (item)
        {
            vm.selectedItemModule_sep = item;
            vm.showbuttonNouvRapport =true;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_sep/index",'id_module_sep',vm.selectedItemModule_sep.id).then(function(result)
              {
                  vm.allparticipant_sep = result.data.response; 
                  console.log( vm.allparticipant_sep);
              });
              vm.showbuttonValider = true;
              apiFactory.getAPIgeneraliserREST("rapport_sep/index",'id_module_sep',vm.selectedItemModule_sep.id).then(function(result)
              {
                  vm.allrapport_sep = result.data.response; 
                  if (vm.allrapport_sep.length>0)
                  {
                    vm.showbuttonNouvRapport =false;
                  }
              });


              vm.stepOne = true;
              vm.stepTwo = false;
            }
        };
        $scope.$watch('vm.selectedItemModule_sep', function()
        {
             if (!vm.allmodule_sep) return;
             vm.allmodule_sep.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_sep.$selected = true;
        });

      
/**********************************fin passation_marches_moe****************************************/

/**********************************debut participant_sep****************************************/
//col table
        vm.participant_sep_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

       

        //fonction selection item region
        vm.selectionParticipant_sep= function (item)
        {
            vm.selectedItemParticipant_sep = item; 
        };
        $scope.$watch('vm.selectedItemParticipant_sep', function()
        {
             if (!vm.allparticipant_sep) return;
             vm.allparticipant_sep.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_sep.$selected = true;
        });

    

        /**********************************debut compte****************************************/
/**********************************fin justificatif attachement****************************************/

//col table
        vm.rapport_sep_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        }];

    

        //fonction selection item justificatif batiment
        vm.selectionRapport_sep= function (item)
        {
            vm.selectedItemRapport_sep = item; 
        };
        $scope.$watch('vm.selectedItemRapport_sep', function()
        {
             if (!vm.allrapport_sep) return;
             vm.allrapport_sep.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_sep.$selected = true;
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
