(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_ufp_daaf_etat.demande_deblocage_daaf_validation_ufp_etat')
        .controller('Demande_deblocage_daaf_validation_ufp_etatController', Demande_deblocage_daaf_validation_ufp_etatController)
    /** @ngInject */
    function Demande_deblocage_daaf_validation_ufp_etatController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,apiUrlFile)
    {
		    var vm    = this;
        vm.affiche_load =false; 

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;
        vm.stepThree = false;

      //initialisation convention_ufp_daaf_entete
        vm.selectedItemConvention_ufp_daaf_entete = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;

     //initialisation demande_deblocage_daaf_validation_ufp
        var NouvelItemDemande_deblocage_daaf_validation_ufp    = false;
        vm.selectedItemDemande_deblocage_daaf_validation_ufp = {} ;
        vm.alldemande_deblocage_daaf_valide_daaf  = [] ;

    //initialisation justificatif_daaf
        vm.selectedItemJustificatif_daaf = {} ;
        vm.alljustificatif_daaf = [] ;
        //vm.situation = 5;
        vm.showbutton = false;

        vm.selectedItemTransfert_ufp = {} ;
        vm.alltransfert_ufp = [] ;

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        vm.datenow = new Date();
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
       /* apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf_invalide","validation",1).then(function(result)
        {
            vm.alldemande_deblocage_daaf_valide_daaf = result.data.response;
            
        });*/

        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true; 
              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getetatconventionwithpourcenfinancByfiltre',
              'date_debut',date_debut,'date_fin',date_fin).then(function(result)
              {
                  vm.allconvention_ufp_daaf_entete = result.data.response; 
                  vm.affiche_load =false; 
              });
        }

         /*****************Debut StepOne convention_ufp_daaf_entete***************/

        //col table
        vm.convention_ufp_daaf_entete_column = [
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Montant convention"},        
        {titre:"Numero vague"},        
        {titre:"Nombre bénéficiaire"},        
        {titre:"Avancement financière"}
        ];
        
        

        //fonction selection item convetion
        vm.selectionConvention_ufp_daaf_entete = function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;           
            
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;

           //recuperation donnée demande
            apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemandedisponible","id_convention_ufp_daaf_entete",item.id).then(function(result)
            {
                vm.alldemande_deblocage_daaf_valide_daaf = result.data.response; 
                console.log(vm.alldemande_deblocage_daaf_valide_daaf );
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_entete', function()
        {
             if (!vm.allconvention_ufp_daaf_entete) return;
             vm.allconvention_ufp_daaf_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_ufp_daaf_entete.$selected = true;

        });             
          
        vm.affichevague = function(num_vague)
        {
          var affiche = 'Première vague';
          if (num_vague==2)
          {
            affiche= 'Deuxième vague';
          }
          return affiche;
        }

        vm.affichage_avancement_financ = function(avance)
        {
          var avance_p=0;
          if (avance)
          {
            avance_p = parseFloat(avance).toFixed(2);
          }
          return avance_p +"%";
        }
  /*****************Fin StepOne convention_ufp_daaf_entete****************/

  /*****************Debut StepTwo demande_deblocage_daaf_validation_ufp****************/

      vm.demande_deblocage_daaf_validation_ufp_column = [
        {titre:"Réference demande"},
        {titre:"Objet"},       
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Situation"}];        

        //fonction selection item region
        vm.selectionDemande_deblocage_daaf_validation_ufp= function (item)
        {
            vm.selectedItemDemande_deblocage_daaf_validation_ufp = item;
           //recuperation donnée demande_deblocage_daaf_validation_ufp
            apiFactory.getAPIgeneraliserREST("justificatif_daaf/index",'id_demande_deblocage_daaf',item.id,'id_tranche',item.tranche.id).then(function(result)
            {
                vm.alljustificatif_daaf = result.data.response;
                console.log(vm.alljustificatif_daaf);
            });
            if (item.validation==3)
            {
              apiFactory.getAPIgeneraliserREST("transfert_ufp/index",'id_demande_deblocage_daaf',item.id).then(function(result)
              {
                  vm.alltransfert_ufp = result.data.response;
                  if (vm.alltransfert_ufp.length >0)
                  {
                    vm.showbuttonNouvtransfert= false;
                  }
              });
            }
            vm.stepTwo = true;
            vm.stepThree = false;
            vm.validation_item = item.validation;
            vm.showbutton =true;
        };
        $scope.$watch('vm.selectedItemDemande_deblocage_daaf_validation_ufp', function()
        {
             if (!vm.alldemande_deblocage_daaf_valide_daaf) return;
             vm.alldemande_deblocage_daaf_valide_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage_daaf_validation_ufp.$selected = true;
        });
       
        vm.situationdemande = function(validation)
        {
            switch (parseInt(validation))
            {
              case 1:
                      return 'Emise';                  
                  break;
              
              case 2:
                        return 'En cours de traitement'; 
                  break;

              case 3:
                  
                  return 'Finalisée'; 
                  break;

             case 4:
                  
                  return 'Rejeté'; 
                  break;

              default:
          
            }
        }

  /*****************Fin StepTwo demande_deblocage_daaf_validation_ufp****************/

  /*****************Fin StepThree justificatif_daaf****************/

  /****************************Debut stepTwo Transfert ufp******************************/
//col table
        vm.transfert_ufp_column = [        
        {titre:"Montant transféré"},        
        {titre:"Frais bancaire"},
        {titre:"Montant total"},
        {titre:"Date"},
        {titre:"Observation"}];

        //fonction selection item transfert_ufp convention cisco/feffi
        vm.selectionTransfert_ufp = function (item)
        {
            vm.selectedItemTransfert_ufp = item;
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemTransfert_ufp', function()
        {
             if (!vm.alltransfert_ufp) return;
             vm.alltransfert_ufp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_ufp.$selected = true;
        });

      
  /*****************Fin StepThree Transfert ufp****************/ 

  //col table
        vm.justificatif_daaf_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

     

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_daaf= function (item)
        {
            vm.selectedItemJustificatif_daaf = item;
        };
        $scope.$watch('vm.selectedItemJustificatif_daaf', function()
        {
             if (!vm.alljustificatif_daaf) return;
             vm.alljustificatif_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_daaf.$selected = true;
        });

        vm.DownloadJustificatif_daaf = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }

  


  /*****************Fin StepThree justificatif_daaf****************/ 
        

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

        //format date affichage sur datatable
        vm.formatDate = function (daty)
        {
          if (daty) 
          {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

        }

        //convertion date au format AAAA-MM-JJ
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

        vm.formatMillier = function (nombre) 
          {   //var nbr = nombre.toFixed(0);
            var nbr=parseFloat(nombre);
            var n = nbr.toFixed(2);
            var spl= n.split('.');
            var apre_virgule = spl[1];
            var avan_virgule = spl[0];

              if (typeof avan_virgule != 'undefined' && parseInt(avan_virgule) >= 0) {
                  avan_virgule += '';
                  var sep = ' ';
                  var reg = /(\d+)(\d{3})/;
                  while (reg.test(avan_virgule)) {
                      avan_virgule = avan_virgule.replace(reg, '$1' + sep + '$2');
                  }
                  return avan_virgule+","+apre_virgule;
              } else {
                  return "0,00";
              }
          }
    }
})();
