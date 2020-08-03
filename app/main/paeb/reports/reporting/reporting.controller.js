(function ()
{
    'use strict';

    angular
        .module('app.paeb.reports.reporting')
        .controller('ReportingController', ReportingController);
    /** @ngInject */
    function ReportingController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,apiUrlexcel)
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

        vm.importerfiltre =function(filtre)
        {   
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load = true ;
            var repertoire = 'bdd_construction';

            apiFactory.getAPIgeneraliserREST("excel_bdd_construction/index",'menu','getdonneeexporter',
                'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
                filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',
                filtre.id_convention_entete,"repertoire",repertoire).then(function(result)
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
        vm.reporting_column = [
        {titre:"1"
        },
        {titre:"2"
        },
        {titre:"3"
        },
        {titre:"4"
        },
        {titre:"5"
        },
        {titre:"6"
        },
        {titre:"7"
        },
        {titre:"8"
        },
        {titre:"9"
        },
        {titre:"10"
        },
        {titre:"11"
        },
        {titre:"12"
        },
        {titre:"13"
        },
        {titre:"14"
        },
        {titre:"15"
        },
        {titre:"16"
        },
        {titre:"17"
        },
        {titre:"18"
        },
        {titre:"19"
        },
        {titre:"20"
        },
        {titre:"21"
        },
        {titre:"22"
        },
        {titre:"23"
        },
        {titre:"24"
        },
        {titre:"25"
        },
        {titre:"26"
        },
        {titre:"27"
        },
        {titre:"28"
        },
        {titre:"29"
        },
        {titre:"30"
        },
        {titre:"31"
        },
        {titre:"32"
        },
        {titre:"33"
        },
        {titre:"34"
        },
        {titre:"35"
        },
        {titre:"36"
        },
        {titre:"37"
        },
        {titre:"38"
        },
        {titre:"39"
        },
        {titre:"40"
        },
        {titre:"41"
        },
        {titre:"42"
        },
        {titre:"43"
        },
        {titre:"44"
        },
        {titre:"45"
        },
        {titre:"46"
        },
        {titre:"47"
        },
        {titre:"48"
        },
        {titre:"49"
        },
        {titre:"50"
        },
        {titre:"51"
        },
        {titre:"52"
        },
        {titre:"53"
        },
        {titre:"54"
        },
        {titre:"55"
        },
        {titre:"56"
        },
        {titre:"57"
        },
        {titre:"58"
        },
        {titre:"59"
        },
        {titre:"60"
        },
        {titre:"61"
        },
        {titre:"62"
        },
        {titre:"63"
        },
        {titre:"64"
        },
        {titre:"65"
        },
        {titre:"66"
        },
        {titre:"67"
        },
        {titre:"68"
        },
        {titre:"69"
        },
        {titre:"70"
        },
        {titre:"71"
        },
        {titre:"72"
        },
        {titre:"73"
        },
        {titre:"74"
        },
        {titre:"75"
        },
        {titre:"76"
        },
        {titre:"77"
        },
        {titre:"78"
        },
        {titre:"79"
        },
        {titre:"80"
        },
        {titre:"81"
        },
        {titre:"82"
        },
        {titre:"83"
        },
        {titre:"84"
        },
        {titre:"85"
        },
        {titre:"86"
        },
        {titre:"87"
        },
        {titre:"88"
        },
        {titre:"89"
        },
        {titre:"90"
        },
        {titre:"91"
        },
        {titre:"92"
        },
        {titre:"93"
        },
        {titre:"94"
        },
        {titre:"95"
        },
        {titre:"96"
        },
        {titre:"97"
        },
        {titre:"98"
        },
        {titre:"99"
        },
        {titre:"100"
        },
        {titre:"101"
        },
        {titre:"102"
        },
        {titre:"103"
        },
        {titre:"104"
        },
        {titre:"105"
        },
        {titre:"106"
        },
        {titre:"107"
        },
        {titre:"108"
        },
        {titre:"109"
        },
        {titre:"110"
        },
        {titre:"111"
        },
        {titre:"112"
        },
        {titre:"113"
        },
        {titre:"114"
        },
        {titre:"115"
        },
        {titre:"116"
        },
        {titre:"117"
        },
        {titre:"118"
        },
        {titre:"119"
        },
        {titre:"120"
        },
        {titre:"121"
        },
        {titre:"122"
        },
        {titre:"123"
        },
        {titre:"124"
        },
        {titre:"125"
        },
        {titre:"126"
        },
        {titre:"127"
        },
        {titre:"128"
        },
        {titre:"129"
        },
        {titre:"130"
        },
        {titre:"131"
        },
        {titre:"132"
        },
        {titre:"133"
        },
        {titre:"134"
        },
        {titre:"135"
        },
        {titre:"136"
        },
        {titre:"137"
        },
        {titre:"138"
        },
        {titre:"139"
        },
        {titre:"140"
        },
        {titre:"141"
        },
        {titre:"142"
        },
        {titre:"143"
        },
        {titre:"144"
        },
        {titre:"145"
        },
        {titre:"146"
        },
        {titre:"147"
        },
        {titre:"148"
        },
        {titre:"149"
        },
        {titre:"150"
        },
        {titre:"161"
        },
        {titre:"162"
        },
        {titre:"163"
        },
        {titre:"164"
        },
        {titre:"165"
        },
        {titre:"166"
        },
        {titre:"167"
        },
        {titre:"168"
        },
        {titre:"169"
        },
        {titre:"170"
        },
        {titre:"171"
        },
        {titre:"172"
        },
        {titre:"173"
        },
        {titre:"174"
        },
        {titre:"175"
        },
        {titre:"176"
        },
        {titre:"177"
        },
        {titre:"178"
        },
        {titre:"179"
        },
        {titre:"180"
        },
        {titre:"181"
        },
        {titre:"182"
        },
        {titre:"183"
        },
        {titre:"184"
        },
        {titre:"185"
        },
        {titre:"186"
        },
        {titre:"187"
        },
        {titre:"188"
        },
        {titre:"189"
        },
        {titre:"190"
        },
        {titre:"191"
        },
        {titre:"192"
        },
        {titre:"193"
        },
        {titre:"194"
        },
        {titre:"195"
        },
        {titre:"196"
        },
        {titre:"197"
        },
        {titre:"198"
        },
        {titre:"199"
        },
        {titre:"200"
        },
        {titre:"201"
        },
        {titre:"202"
        },
        {titre:"203"
        },
        {titre:"204"
        },
        {titre:"205"
        },
        {titre:"206"
        },
        {titre:"207"
        },
        {titre:"208"
        },
        {titre:"209"
        },
        {titre:"210"
        },
        {titre:"211"
        },
        {titre:"212"
        },
        {titre:"213"
        },
        {titre:"214"
        },
        {titre:"215"
        },
        {titre:"216"
        },
        {titre:"217"
        },
        {titre:"218"
        },
        {titre:"219"
        },
        {titre:"220"
        },
        {titre:"221"
        },
        {titre:"222"
        },
        {titre:"223"
        },
        {titre:"224"
        },
        {titre:"225"
        },
        {titre:"226"
        },
        {titre:"227"
        },
        {titre:"228"
        },
        {titre:"229"
        },
        {titre:"230"
        },
        {titre:"231"
        },
        {titre:"232"
        },
        {titre:"233"
        },
        {titre:"234"
        },
        {titre:"235"
        },
        {titre:"236"
        },
        {titre:"237"
        },
        {titre:"238"
        },
        {titre:"239"
        },
        {titre:"240"
        },
        {titre:"241"
        }
        
        ]; 
        vm.affiche_load = false ;

        vm.importerfiltre =function(filtre)
        {   
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load = true ;
            var repertoire = 'bdd_construction';

            apiFactory.getAPIgeneraliserREST("excel_bdd_construction/index",'menu','getdonneeexporter',
                'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
                filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',
                filtre.id_convention_entete,"repertoire",repertoire).then(function(result)
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

            apiFactory.getAPIgeneraliserREST("excel_bdd_construction/index",
                'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
                filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',
                filtre.id_convention_entete,"repertoire",repertoire).then(function(result)
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
    }


/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
