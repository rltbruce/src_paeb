(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.reporting.bdd_construction_paeb')
        .controller('Bdd_construction_paebController', Bdd_construction_paebController);
    /** @ngInject */
    function Bdd_construction_paebController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        var selectedItemTete;
        vm.regions = [];
        vm.ciscos = []; 

        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.stepFor           = false;
        //vm.usercisco = [];
      /*****fin initialisation*****/

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        }, function error(response){ alert('something went wrong')});

        vm.filtre_change_region = function(item)
        { vm.filtre.id_cisco = null;
          apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
          {
            vm.ciscos = result.data.response;
            console.log(vm.ciscos);
          }, function error(result){ alert('something went wrong')});
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
          apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
          {
            vm.communes = result.data.response;
            console.log(vm.communes);
          }, function error(result){ alert('something went wrong')});
        }
        vm.filtre_change_commune = function(item)
        { vm.filtre.id_ecole = null;
          apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleBycommune","id_commune",item.id_commune).then(function(result)
          {
            vm.ecoles = result.data.response;
            console.log(vm.ecoles);
          }, function error(result){ alert('something went wrong')});
        }
        vm.filtre_change_ecole = function(item)
        { vm.filtre.id_convention_entete = null;
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
          {
            vm.convention_cisco_feffi_entetes = result.data.response;
            console.log(vm.convention_cisco_feffi_entetes );
          }, function error(result){ alert('something went wrong')});
        }

       /* apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventioninvalideBycisco','id_cisco',usercisco.id).then(function(result)
        {
            vm.allconvention_cife_tete = result.data.response; 
                console.log(vm.allconvention_cife_tete);
        });*/
        vm.resultatfiltrer = function(item)
        {
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventiondetailfiltreByid","id_convention_entete",item.id_convention_entete).then(function(result)
          {
            vm.convention_cisco_feffi_details = result.data.response;
            console.log(vm.convention_cisco_feffi_details );
          }, function error(result){ alert('something went wrong')});
        }

        vm.formatMillier = function (nombre) 
        {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
        }

        vm.exportExcel = function(item)
      {
        vm.affiche_load = true ;
        var repertoire = 'bdd_construction';
            apiFactory.getAPIgeneraliserREST("excel_bdd_construction/index","menu","exportconventionByid","id_convention_entete",item.id_convention_entete,"repertoire",repertoire).then(function(result)
          {
            
            vm.status    = result.data.status; 
          
            if(vm.status)
            {
                vm.nom_file = result.data.nom_file;            
                window.location = apiUrlexcel+"bdd_construction/"+vm.nom_file ;
                vm.affiche_load =false; 

            }else{
                vm.message=result.data.message;
                vm.Alert('Export en excel',vm.message);
                vm.affiche_load =false; 
            }
          });        
      }
      /*****************debut convention entete***************/

        //col table
        vm.donnee_globale_column = [
        {titre:"Region"
        },
        {titre:"Cisco"
        },
        {titre:"Commune"
        },
        {titre:"Ecole"
        },
        {titre:"Convention"
        }];
        

      /*****************fin convention entete***************/

      /*****************debut cout divers**************/

      vm.estimation_convention_column = 
      [        
        {
          titre:"Nom Feffi"
        },
        {
          titre:"Date signature"
        },
        {
          titre:"Batiment"
        },
        {
          titre:"Latrine"
        },
        {
          titre:"Mobilier"
        },
        {
          titre:"Maitrise d'oeuvre"
        },
        {
          titre:"Sous total depense"
        },
        {
          titre:"Frais feffi"
        },
        {
          titre:"Montant convention"
        },
        {
          titre:"Avenant"
        },
        {
          titre:"Montant apres avenant"
        }
      ];

  
      /*****************fin cout divers**************/
      /*****************debut convention detail**************/

      //col table
        vm.suivi_financier_daaf_feffi_column = 
      [        
        {
          titre:"Montant 1ere trache"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"Montant 2ere trache"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"Montant 3ere trache"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"Cumul"
        },
        {
          titre:"Decaissement"
        },
        {
          titre:"Observation"
        }
      ];

        vm.suivi_financier_feffi_prestataire_column = [
        {
          titre:"Montant"
        },
        {
          titre:"Decaissement"
        },
        {
          titre:"Observation"
        }];

        vm.suivi_financier_fonctionnement_feffi_column = [
        {
          titre:"Montant"
        },
        {
          titre:"Decaissement"
        },
        {
          titre:"Observation"
        }];

  
       
      /*****************fin convention detail****************/

      /*****************debut batiment construction***************/
      //col table

        vm.suivi_passation_pr_column = [        
        {
          titre:"Appel manifestation"
        },
        {
          titre:"Lancement D.P"
        },
        {
          titre:"Remise proposition"
        },
        {
          titre:"Nombre plis reçu"
        },
        {
          titre:"Date O.S"
        },
        {
          titre:"Nom consultant"
        },
        {
          titre:"Montan contrat"
        },
        {
          titre:"Cumul paiement"
        },
        {
          titre:"Pourcentage"
        },
        {
          titre:"Avenant"
        },
        {
          titre:"Montant apres avenant"
        }];

        vm.module_dpp_column = [       
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
        {titre:"Nombre prévisionnel participant_dpp"
        },
        {titre:"Nombre de participant_dpp"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];

        vm.module_odc_column = [
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
        {titre:"Nombre prévisionnel participant_odc"
        },
        {titre:"Nombre de participant_odc"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];

        vm.module_pmc_column = [
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
        {titre:"Nombre prévisionnel participant_pmc"
        },
        {titre:"Nombre de participant_pmc"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];

        vm.module_gfpc_column = [
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

        vm.module_sep_column = [
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

        vm.module_emies_column = [
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
        {titre:"Nombre prévisionnel participant_emies"
        },
        {titre:"Nombre de participant_emies"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];


      /*****************fin batiment construction***************/


       /*****************debut latrine construction***************/
      //col table
        vm.passation_marches_moe_column = [
        {titre:"Date shortlist"
        },
        {titre:"Date Appel manifestation"
        },
        {titre:"Date lancement DP"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre plis reçu"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Nom consultant"
        },
        {titre:"Statut"
        },
        {titre:"Montant"
        },
        {titre:"Avenant"
        },
        {titre:"Montant apres avenant"
        },
        {titre:"Observation"
        }];
        vm.affichageStatut= function(statut)
        { var stat= '';
          switch (statut)
            {
              case '1':
                 stat = 'BE';
 
                  break;
              
              case '2':
                   stat = 'CI';
                  break;

              default:
          
            }
         return stat;   
        }

        vm.suivi_prestation_mtdaomg_column = [
        {titre:"Livraison MT"
        },
        {titre:"Date approbation"
        },
        {titre:"Livraison DAO"
        },
        {titre:"Date approbation"
        },
        {titre:"Livraison Manuel gestion"
        },
        {titre:"Date expiration police d'assurance"
        },
        {titre:"Observation"
        }];
        vm.suivi_prestation_rapmens_column = [        
        {titre:"Livraison Rapport mensuel"
        },
        {titre:"Date approbation"
        },
        {titre:"Observation"
        }];

        vm.suivi_paiement_moe_column = [
        {
          titre:"Montant"
        },
        {
          titre:"Decaissement"
        },
        {
          titre:"Observation"
        }];

      /*****************fin latrine construction***************/

      vm.passation_marches_mpe_column = [
        {titre:"Date lancement"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre offre reçu"
        },
        {titre:"montant moins chere"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Titulaire travaux"
        },
        {titre:"Montant 2 blocs"
        },
        {titre:"Montant latrine"
        },
        {titre:"Montant mobilier"
        },
        {titre:"Montant avenant"
        },
        {titre:"Montant après avenant"
        },
        {titre:"Observention"
        }];

       /* vm.montant_contrat_mpe_column = [
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Montant total"
        },
        {titre:"Avenant"
        },
        {titre:"Montant apres avenant"
        },
        {titre:"Délai éxecution"
        },
        {titre:"Action"
        }];*/

        vm.suivi_execution_mpe_column = [
        {
          titre:"Phase sous projet"
        },
        {titre:"Date prévisionnelle debut travaux"
        },
        {titre:"Date réelle début travaux"
        },
        {titre:"Date expiration police assurance"
        },
        {titre:"Delai execution"
        },
        {titre:"Observation"
        }];
        vm.reception_mpe_column = [       
        {titre:"Date prévisionnelle réception technique"
        },
        {titre:"Date réelle de réception technique"
        },
        {titre:"Date levée des réserves de la réception technique"
        },
        {titre:"Date prévisionnelle réception provisoire"
        },
        {titre:"Date réelle réception provisoire"
        },
        {titre:"Date prévisionnelle de levée des réserves avant RD"
        },
        {titre:"Date réelle de levée des réserves avant RD"
        },
        {titre:"Date prévisionnelle réception définitive"
        },
        {titre:"Date réelle réception définitive"
        },
        {titre:"Observation"
        }];

        vm.suivi_paiement_batiment_column = 
      [        
        {
          titre:"1ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"2ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"3ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"4ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"5ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"Cumul"
        },
        {
          titre:"Taux avancement"
        }
      ];
      vm.suivi_paiement_latrine_column = 
      [        
        {
          titre:"1ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"2ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"3ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"Cumul"
        },
        {
          titre:"Taux avancement"
        }
      ];

      vm.suivi_paiement_mobilier_column = 
      [        
        {
          titre:"1ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"2ere paiement"
        },
        {
          titre:"Date approbation"
        },
        {
          titre:"Cumul"
        },
        {
          titre:"Taux avancement"
        }
      ];

      /*****************debut mobilier construction***************/
       vm.transfert_reliquat_column = [
        {titre:"Montant"
        },
        {titre:"Objet utilisation"
        },
        {titre:"Situation utilisation"
        }];
        vm.afficheobjet_utilisation = function(objet)
        { 
          var affiche = "Fournir des fourniture";
          if (objet ==0 )
          {
            affiche = "Amelioration infrastructure";
          }
          return affiche;
        }

        vm.affichesituation_utilisation = function(objet)
        { 
          var affiche = "Transferer";
          if (objet ==0 )
          {
            affiche = "Pas transferer";
          }
          return affiche;
        }

      /*****************fin mobilier construction***************/
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
        vm.Alert = function(titre,content)
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
    }
})();
