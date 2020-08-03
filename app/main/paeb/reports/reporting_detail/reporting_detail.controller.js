(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting_detail')
        .controller('Reporting_detailController', Reporting_detailController);
    /** @ngInject */
    function Reporting_detailController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		    var vm = this;
         vm.datenow = new Date();
         vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
          order: []
        };
        vm.formfiltre = false;
        vm.showboutonfiltre = true;
        vm.datafound = false;
        vm.cacher = {};
        vm.rowspan_maitrise_oeuvre = 2;
        vm.colspan_convention_feffi = 30;
        vm.current_colspan_convention_feffi =vm.colspan_convention_feffi;

        vm.colspan_partenaire_relais = 83;
        vm.current_colspan_partenaire_relais =vm.colspan_partenaire_relais;

        vm.colspan_maitrise_oeuvre = 31;
        vm.current_colspan_maitrise_oeuvre =vm.colspan_maitrise_oeuvre;

        vm.colspan_entreprise = 60;
        vm.current_colspan_entreprise =vm.colspan_entreprise;

        vm.cacher.convention_feffi = true;
       // vm.cacher.estimation_convention=true;
        vm.cacher.suivi_financier_daaf_feffi=true;
        vm.cacher.suivi_financier_feffi_prestataire=true;
        vm.cacher.suivi_financier_feffi_fonctionnement=true;
        vm.cacher.total_convention_decaissee=true;
        vm.cacher.reliquat_des_fonds=true;

        vm.cacher.partenaire_relais = true;
        vm.cacher.suivi_passation_marches_pr=true;
        vm.cacher.suivi_prestation_pr=true;

        vm.cacher.maitrise_oeuvre = true;
        vm.cacher.suivi_passation_marches_moe=true;
        vm.cacher.suivi_prestation_moe=true;
        vm.cacher.suivi_paiement_moe=true;
        vm.cacher.police_assurance_moe=true;

        vm.cacher.entreprise = true;
        vm.cacher.suivi_passation_marches_mpe=true;
        vm.cacher.suivi_execution_travau_mpe=true;
        vm.cacher.suivi_paiement_mpe=true;
        //vm.cacher.police_assurance_mpe=true;

        vm.cacher.indicateur=true;
        vm.cacher.transfert_reliquat = true;

        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        }, function error(response){ alert('something went wrong')});

        vm.afficherfiltre = function()
        {
            vm.formfiltre = true;
            vm.showboutonfiltre = false;
        }

        vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                    console.log(vm.ciscos);
                }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.ciscos = [];
            }
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
                console.log(vm.communes);
              }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.ecoles = result.data.response;
                console.log(vm.ecoles);
              }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.ecoles = [];
            }
          
        }
        vm.filtre_change_ecole = function(item)
        { 
            vm.filtre.id_convention_entete_entete = null;
            if (item.id_ecole != '*')
            {
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
                  {
                    vm.convention_cisco_feffi_entetes = result.data.response;
                    console.log(vm.convention_cisco_feffi_entetes );
                  }, function error(result){ alert('something went wrong')});
            }
        }


    /*******************************Debut convention feffii******************************/

       /* vm.change_convention_feffi = function(checkbox)
        {            
            if (checkbox.convention_feffi == true)
            {
                //checkbox.estimation_convention=true;
                checkbox.suivi_financier_daaf_feffi=true;
                checkbox.suivi_financier_feffi_prestataire=true;
                checkbox.suivi_financier_feffi_fonctionnement=true;
                checkbox.total_convention_decaissee=true;
                checkbox.reliquat_des_fonds=true;
            }
            else
            {
                //checkbox.estimation_convention=false;
                checkbox.suivi_financier_daaf_feffi=false;
                checkbox.suivi_financier_feffi_prestataire=false;
                checkbox.suivi_financier_feffi_fonctionnement=false;
                checkbox.total_convention_decaissee=false;
                checkbox.reliquat_des_fonds=false;
            }
        }*/
       /* vm.change_estimation_convention = function(checkbox)
        {
            //checkbox.stimation_convention != checkbox.stimation_convention;
            if (//checkbox.estimation_convention==false &&
                checkbox.suivi_financier_daaf_feffi==false &&
                checkbox.suivi_financier_feffi_prestataire==false &&
                checkbox.suivi_financier_feffi_fonctionnement==false &&
                checkbox.total_convention_decaissee==false &&
                checkbox.reliquat_des_fonds==false)
            {
                checkbox.convention_feffi = false;
            }
            else
            {
                checkbox.convention_feffi = true;
            }
        }*/
        vm.change_suivi_financier_daaf_feffi = function(checkbox)
        {
           /* if (//checkbox.estimation_convention==false &&
                checkbox.suivi_financier_daaf_feffi==false &&
                checkbox.suivi_financier_feffi_prestataire==false &&
                checkbox.suivi_financier_feffi_fonctionnement==false &&
                checkbox.total_convention_decaissee==false &&
                checkbox.reliquat_des_fonds==false)
            {
                checkbox.convention_feffi = false;
            }
            else
            {
                checkbox.convention_feffi = true;
            }*/
            if (checkbox.suivi_financier_daaf_feffi == false)
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi - 11;
            }
            else
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi + 11;
            }
        }
        vm.change_suivi_financier_feffi_prestataire = function(checkbox)
        {
            if (checkbox.suivi_financier_feffi_prestataire == false)
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi - 3;
            }
            else
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi + 3;
            }
        }
        vm.change_suivi_financier_feffi_fonctionnement = function(checkbox)
        {
            if (checkbox.suivi_financier_feffi_fonctionnement == false)
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi - 3;
            }
            else
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi + 3;
            }
        }
        vm.change_total_convention_decaissee = function(checkbox)
        {
            if (checkbox.total_convention_decaissee == false)
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi - 1;
            }
            else
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi + 1;
            }
        }
        vm.change_reliquat_des_fonds = function(checkbox)
        {
            if (checkbox.reliquat_des_fonds == false)
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi - 1;
            }
            else
            {
                vm.current_colspan_convention_feffi = vm.current_colspan_convention_feffi + 1;
            }
        }
    
    /*******************************Fin convention feffii******************************/
    
    /*******************************Debut partenaire relais******************************/

        vm.change_partenaire_relais = function(checkbox)
        {            
            if (checkbox.partenaire_relais == true)
            {
                checkbox.suivi_passation_marches_pr=true;
                checkbox.suivi_prestation_pr=true;
                vm.current_colspan_partenaire_relais = vm.colspan_partenaire_relais;
            }
            else
            {
                checkbox.suivi_passation_marches_pr=false;
                checkbox.suivi_prestation_pr=false;                
                vm.current_colspan_partenaire_relais = 0;
            }
        }
        vm.change_suivi_passation_marches_pr = function(checkbox)
        {
            //checkbox.stimation_convention != checkbox.stimation_convention;
            if (checkbox.suivi_passation_marches_pr==false &&
                checkbox.suivi_prestation_pr==false)
            {
                checkbox.partenaire_relais = false;
            }
            else
            {
                checkbox.partenaire_relais = true;
            }
            if (checkbox.suivi_passation_marches_pr == false)
            {
                vm.current_colspan_partenaire_relais = vm.current_colspan_partenaire_relais - 11;
            }
            else
            {
                vm.current_colspan_partenaire_relais = vm.current_colspan_partenaire_relais + 11;
            }

        }
        vm.change_suivi_prestation_pr = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_pr==false &&
                checkbox.suivi_prestation_pr==false)
            {
                checkbox.partenaire_relais = false;
            }
            else
            {
                checkbox.partenaire_relais = true;
            }
            if (checkbox.suivi_prestation_pr == false)
            {
                vm.current_colspan_partenaire_relais = vm.current_colspan_partenaire_relais - 72;
            }
            else
            {
                vm.current_colspan_partenaire_relais = vm.current_colspan_partenaire_relais + 72;
            }
        }

    
    /*******************************Debut partenaire relais******************************/


    /*******************************Debut maitrise d'oeuvre******************************/

        vm.change_maitrise_oeuvre = function(checkbox)
        {            
            if (checkbox.maitrise_oeuvre == true)
            {
                checkbox.suivi_passation_marches_moe=true;
                checkbox.suivi_prestation_moe=true;
                checkbox.suivi_paiement_moe=true;
                checkbox.police_assurance_moe=true;

                vm.current_colspan_maitrise_oeuvre = vm.colspan_maitrise_oeuvre;
                vm.rowspan_maitrise_oeuvre =2;
            }
            else
            {
                checkbox.suivi_passation_marches_moe=false;
                checkbox.suivi_prestation_moe=false;
                checkbox.suivi_paiement_moe=false;
                checkbox.police_assurance_moe=false;

                vm.current_colspan_maitrise_oeuvre = 0;
            }
        }
        vm.change_suivi_passation_marches_moe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_moe==false &&
                checkbox.suivi_prestation_moe==false &&
                checkbox.suivi_paiement_moe==false &&
                checkbox.police_assurance_moe==false)
            {
                checkbox.maitrise_oeuvre = false;
            }
            else
            {
                checkbox.maitrise_oeuvre = true;
            }


            if (checkbox.suivi_passation_marches_moe == false)
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre - 18;
            }
            else
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre + 18;
            }
        }
        vm.change_suivi_prestation_moe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_moe==false &&
                checkbox.suivi_prestation_moe==false &&
                checkbox.suivi_paiement_moe==false &&
                checkbox.police_assurance_moe==false)
            {
                checkbox.maitrise_oeuvre = false;
            }
            else
            {
                checkbox.maitrise_oeuvre = true;
            }

            if (checkbox.suivi_prestation_moe == false)
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre - 10;
            }
            else
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre + 10;
            }
        }

        vm.change_suivi_paiement_moe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_moe==false &&
                checkbox.suivi_prestation_moe==false &&
                checkbox.suivi_paiement_moe==false &&
                checkbox.police_assurance_moe==false)
            {
                checkbox.maitrise_oeuvre = false;
            }
            else
            {
                checkbox.maitrise_oeuvre = true;
            }


            if (checkbox.suivi_paiement_moe == false)
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre - 2;
            }
            else
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre + 2;
            }
        }

        vm.change_police_assurance_moe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_moe==false &&
                checkbox.suivi_prestation_moe==false &&
                checkbox.suivi_paiement_moe==false &&
                checkbox.police_assurance_moe==false)
            {
                checkbox.maitrise_oeuvre = false;
            }
            else
            {
                checkbox.maitrise_oeuvre = true;
            }

            if (checkbox.police_assurance_moe == false)
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre - 1;
            }
            else
            {
                vm.current_colspan_maitrise_oeuvre = vm.current_colspan_maitrise_oeuvre + 1;
            }
        }

    
    /*******************************Debut maitrise d'oeuvre******************************/

    /*******************************Debut entreprise******************************/

        vm.change_entreprise = function(checkbox)
        {            
            if (checkbox.entreprise == true)
            {
                checkbox.suivi_passation_marches_mpe=true;
                checkbox.suivi_execution_travau_mpe=true;
                checkbox.suivi_paiement_mpe=true;
                //checkbox.police_assurance_mpe=true;

                vm.current_colspan_entreprise = vm.colspan_entreprise;
            }
            else
            {
                checkbox.suivi_passation_marches_mpe=false;
                checkbox.suivi_execution_travau_mpe=false;
                checkbox.suivi_paiement_mpe=false;
                //checkbox.police_assurance_mpe=false;

                vm.current_colspan_entreprise = 0;
            }
        }
        vm.change_suivi_passation_marches_mpe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_mpe==false &&
                checkbox.suivi_execution_travau_mpe==false &&
                checkbox.suivi_paiement_mpe==false //&&
                //checkbox.police_assurance_mpe==false
                )
            {
                checkbox.entreprise = false;
            }
            else
            {
                checkbox.entreprise = true;
            }

            if (checkbox.suivi_passation_marches_mpe == false)
            {
                vm.current_colspan_entreprise = vm.current_colspan_entreprise - 20;
            }
            else
            {
                vm.current_colspan_entreprise = vm.current_colspan_entreprise + 20;
            }
        }
        vm.change_suivi_execution_travau_mpe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_mpe==false &&
                checkbox.suivi_execution_travau_mpe==false &&
                checkbox.suivi_paiement_mpe==false //&&
                //checkbox.police_assurance_mpe==false
                )
            {
                checkbox.entreprise = false;
            }
            else
            {
                checkbox.entreprise = true;
            }

            if (checkbox.suivi_execution_travau_mpe == false)
            {
                vm.current_colspan_entreprise = vm.current_colspan_entreprise - 16;
            }
            else
            {
                vm.current_colspan_entreprise = vm.current_colspan_entreprise + 16;
            }
        }

        vm.change_suivi_paiement_mpe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_mpe==false &&
                checkbox.suivi_execution_travau_mpe==false &&
                checkbox.suivi_paiement_mpe==false //&&
                //checkbox.police_assurance_mpe==false
                )
            {
                checkbox.entreprise = false;
            }
            else
            {
                checkbox.entreprise = true;
            }


            if (checkbox.suivi_paiement_mpe == false)
            {
                vm.current_colspan_entreprise = vm.current_colspan_entreprise - 24;
            }
            else
            {
                vm.current_colspan_entreprise = vm.current_colspan_entreprise + 24;
            }
        }

       /* vm.change_police_assurance_mpe = function(checkbox)
        {
            if (checkbox.suivi_passation_marches_mpe==false &&
                checkbox.suivi_execution_travau_mpe==false &&
                checkbox.suivi_paiement_mpe==false &&
                checkbox.police_assurance_mpe==false)
            {
                checkbox.entreprise = false;
            }
            else
            {
                checkbox.entreprise = true;
            }
        }*/

         vm.change_transfert_reliquat = function(checkbox)
        {
            console.log(checkbox.transfert_reliquat);
            console.log(vm.cacher);
        }

    
    /*******************************Debut entreprise******************************/

       /* vm.reporting_column = [
        {titre:"DONNEES GLOBALES"
        },
        {titre:"CONVENTION FEFFI"
        },
        {titre:"PARTENAIRE RELAIS"
        },
        {titre:"MAITRISE D'OEUVRE"
        },
        {titre:"ENTREPRISE"
        },
        {titre:"GESTION RELIQUAT DES FONDS"
        },
        {titre:"INDICATEUR"
        }];*/
        
        vm.affiche_load = false ;

        vm.importerfiltre =function(filtre)
        {   
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load = true ;
            var repertoire = 'bdd_construction';

            apiFactory.getAPIall("excel_bdd_construction_detail/index?menu=getdonneeexporter&date_debut="+date_debut+"&date_fin="+date_fin+"&lot="+filtre.lot+"&id_region="+filtre.id_region+"&id_cisco="+
                filtre.id_cisco+"&id_commune="+filtre.id_commune+"&id_ecole="+filtre.id_ecole+"&id_convention_entete="+
                filtre.id_convention_entete+"&repertoire="+repertoire+"&convention_feffi="+vm.cacher.convention_feffi+"&suivi_financier_daaf_feffi="
                +vm.cacher.suivi_financier_daaf_feffi+"&suivi_financier_feffi_prestataire="+vm.cacher.suivi_financier_feffi_prestataire+
                "&suivi_financier_feffi_fonctionnement="+vm.cacher.suivi_financier_feffi_fonctionnement+"&total_convention_decaissee="
                +vm.cacher.total_convention_decaissee+"&reliquat_des_fonds="+vm.cacher.reliquat_des_fonds+"&partenaire_relais="
                +vm.cacher.partenaire_relais+"&suivi_passation_marches_pr="+vm.cacher.suivi_passation_marches_pr+"&suivi_prestation_pr="
                +vm.cacher.suivi_prestation_pr+"&maitrise_oeuvre="+vm.cacher.maitrise_oeuvre+"&suivi_passation_marches_moe="
                +vm.cacher.suivi_passation_marches_moe+"&suivi_prestation_moe="+vm.cacher.suivi_prestation_moe+"&suivi_paiement_moe="
                +vm.cacher.suivi_paiement_moe+"&police_assurance_moe="+vm.cacher.police_assurance_moe+"&entreprise="+vm.cacher.entreprise+
                "&suivi_passation_marches_mpe="+vm.cacher.suivi_passation_marches_mpe+"&suivi_execution_travau_mpe="+vm.cacher.suivi_execution_travau_mpe+
                "&suivi_paiement_mpe="+vm.cacher.suivi_paiement_mpe+"&indicateur="+vm.cacher.indicateur+"&transfert_reliquat="+vm.cacher.transfert_reliquat+"").then(function(result)
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
                console.log(result.data.data);
            });
        } 

        vm.recherchefiltre =function(filtre)
        {   
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load = true ;
            var repertoire = 'bdd_construction';

            apiFactory.getAPIall("excel_bdd_construction_detail/index?date_debut="+date_debut+"&date_fin="+date_fin+"&lot="+filtre.lot+"&id_region="+filtre.id_region+"&id_cisco="+
                filtre.id_cisco+"&id_commune="+filtre.id_commune+"&id_ecole="+filtre.id_ecole+"&id_convention_entete="+
                filtre.id_convention_entete+"&repertoire="+repertoire+"&convention_feffi="+vm.cacher.convention_feffi+"&suivi_financier_daaf_feffi="
                +vm.cacher.suivi_financier_daaf_feffi+"&suivi_financier_feffi_prestataire="+vm.cacher.suivi_financier_feffi_prestataire+
                "&suivi_financier_feffi_fonctionnement="+vm.cacher.suivi_financier_feffi_fonctionnement+"&total_convention_decaissee="
                +vm.cacher.total_convention_decaissee+"&reliquat_des_fonds="+vm.cacher.reliquat_des_fonds+"&partenaire_relais="
                +vm.cacher.partenaire_relais+"&suivi_passation_marches_pr="+vm.cacher.suivi_passation_marches_pr+"&suivi_prestation_pr="
                +vm.cacher.suivi_prestation_pr+"&maitrise_oeuvre="+vm.cacher.maitrise_oeuvre+"&suivi_passation_marches_moe="
                +vm.cacher.suivi_passation_marches_moe+"&suivi_prestation_moe="+vm.cacher.suivi_prestation_moe+"&suivi_paiement_moe="
                +vm.cacher.suivi_paiement_moe+"&police_assurance_moe="+vm.cacher.police_assurance_moe+"&entreprise="+vm.cacher.entreprise+
                "&suivi_passation_marches_mpe="+vm.cacher.suivi_passation_marches_mpe+"&suivi_execution_travau_mpe="+vm.cacher.suivi_execution_travau_mpe+
                "&suivi_paiement_mpe="+vm.cacher.suivi_paiement_mpe+"&indicateur="+vm.cacher.indicateur+"&transfert_reliquat="+vm.cacher.transfert_reliquat+"").then(function(result)
            {
                vm.allreporting =result.data.response;
                vm.affiche_load =false; 
                if(vm.allreporting.length>0)
                {
                    vm.datafound = true;
                }
                else
                {
                    vm.datafound = false;
                }
                console.log(result.data.response);

                console.log(vm.rowspan_maitrise_oeuvre);

                console.log(vm.current_colspan_maitrise_oeuvre);
            });
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
            vm.showboutonfiltre = true;
            vm.formfiltre = false;
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

        //Alert
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
    }


/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
