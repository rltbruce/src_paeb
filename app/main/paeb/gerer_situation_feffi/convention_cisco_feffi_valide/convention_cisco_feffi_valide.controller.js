(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi_valide')
        .controller('Convention_cisco_feffi_valideController', Convention_cisco_feffi_valideController);
    /** @ngInject */
    function Convention_cisco_feffi_valideController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrlexcel)
    {
     /*****debut initialisation*****/

        var vm    = this;
        vm.allfeffi = [];
        vm.allsite = [];

        vm.selectedItemcout_maitrise_construction = {} ;

        vm.selectedItemcout_sousprojet_construction = {} ;

        vm.date_now         = new Date();
        vm.allcisco         = [] ;
        vm.selectedItemTete = {} ;
        vm.allconvention_cife_tete  = [] ;
        vm.allcompte_feffi = [];

        vm.selectedItemDetail = {} ;

        vm.allconvention_cife_detail  = [] ;

        //vm.allattachement_batiment  = [] ;
        vm.alltype_batiment  = [] ;

        vm.selectedItemBatiment_construction = {} ;
        vm.allbatiment_construction  = [] ;

        //vm.allattachement_latrine  = [] ;
        vm.alltype_latrine  = [] ;

        vm.selectedItemLatrine_construction = {} ;
        vm.alllatrine_construction  = [] ;
        vm.subvention_initial = [];

        //vm.allattachement_mobilier  = [] ;
        vm.alltype_mobilier  = [] ;

        vm.selectedItemMobilier_construction = {} ;
        vm.allmobilier_construction  = [] ;
        //vm.usercisco = [];
      /*****fin initialisation*****/

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: true          
        };

        //style
        vm.dtOptionsperso = {
          dom: '<"top">rt<"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };


        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        });

        vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                    console.log(vm.ciscos);
                });
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
              });
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
                apiFactory.getAPIgeneraliserREST("zap/index","cle_etrangere",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
                console.log(vm.zaps);
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.filtre_change_zap = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.ecoles = result.data.response;
                console.log(vm.ecoles);
              });
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
                  });
            }
        }

/********************************Fin get convention entete by cisco***********************************/

/********************************Debut affichage nombre **********************************************/

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

/********************************Fin affichage nombre **********************************************/


/**********************************Debut convention entete******************************************/

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

         vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
              console.log(filtre);
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getfiltre_convention',
                'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
                filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',
                filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_cife_tete    = result.data.response; 
                console.log(vm.allconvention_cife_tete);
            });
        }

        //col table
        vm.convention_cife_tete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Site"
        },
        {titre:"Type convention"
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
        },
        {titre:"Utilisateur"
        }];
        
 
        //fonction selection item entete convention cisco/feffi
        vm.selectionTete = function (item)
        {
            vm.selectedItemTete = item;            
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvDetail=true;
            vm.showbuttonNouvBatiment=true;
            //recuperation donnée convention
           if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.allconvention_cife_detail = result.data.response;

                  console.log(vm.selectedItemTete);
                  console.log(vm.allconvention_cife_detail);
              });
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                vm.allcompte_feffi = result.data.response;
                console.log(vm.allcompte_feffi);
               
              });

              //Récupération cout divers par convention

              apiFactory.getAPIgeneraliserREST("cout_maitrise_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                vm.allcout_maitrise_construction = result.data.response;
               
              });
              apiFactory.getAPIgeneraliserREST("cout_sousprojet_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                vm.allcout_sousprojet_construction = result.data.response;
               
              });
              //recuperation donnée convention
           
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;
                  console.log(vm.allbatiment_construction);
              });

              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                  console.log(vm.alllatrine_construction);
              });


              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  console.log(vm.allmobilier_construction);
              });

              //recuperation donnée batiment ouvrage
              apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getbatimentByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_batiment = result.data.response;
                console.log(vm.alltype_batiment);
              });

              apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_latrine = result.data.response;
                console.log(vm.alltype_latrine);
              });

              apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_mobilier = result.data.response;
                console.log(vm.alltype_mobilier);
              });

              apiFactory.getAPIgeneraliserREST("type_cout_maitrise/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_cout_maitrise = result.data.response;
                console.log(vm.alltype_cout_maitrise);
              });
              apiFactory.getAPIgeneraliserREST("type_cout_sousprojet/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_cout_sousprojet = result.data.response;
                console.log(vm.alltype_cout_sousprojet);
              });
            };           

        };
        $scope.$watch('vm.selectedItemTete', function()
        {
             if (!vm.allconvention_cife_tete) return;
             vm.allconvention_cife_tete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTete.$selected = true;
        });


        vm.affichage_type_convention = function(type_convention)
        { 
          var affichage = 'Initial';
          if(type_convention == 0)
          {
            affichage = 'Autre';
          }
          return affichage;
        }

/**********************************fin convention entete***********************************/


/***************************************debut cout maitrise***********************************/

      vm.cout_maitrise_construction_column = 
      [
        {
          titre:"Maitrise d'oeuvre"
        },
        {
          titre:"Coût"
        }
      ];     

        vm.selectcout_maitrise_construction = function(item)
        {
          vm.selectedItemcout_maitrise_construction = item ;
          console.log(vm.selectedItemcout_maitrise_construction);
        }

        $scope.$watch('vm.selectedItemcout_maitrise_construction', function()
        {
             if (!vm.allcout_maitrise_construction) return;
             vm.allcout_maitrise_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemcout_maitrise_construction.$selected = true;
        });

        vm.changetype_cout_maitrise = function(item)
        { 
            var typ_mai = vm.alltype_cout_maitrise.filter(function(obj)
            {
                return obj.id == item.id_type_cout_maitrise;
            });
            item.cout = parseInt(typ_mai[0].cout_maitrise);
            
        };

/*********************************fin cout maitrise*************************************/

/********************************debut cout sousprojet*******************************/
      vm.cout_sousprojet_construction_column = 
      [
        {
          titre:"Sous projet"
        },
        {
          titre:"Coût"
        }
      ];

        vm.selectcout_sousprojet_construction = function(item)
        {
          vm.selectedItemcout_sousprojet_construction = item ;
          console.log(vm.selectedItemcout_sousprojet_construction);
        }

        $scope.$watch('vm.selectedItemcout_sousprojet_construction', function()
        {
             if (!vm.allcout_sousprojet_construction) return;
             vm.allcout_sousprojet_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemcout_sousprojet_construction.$selected = true;
        });

        vm.changetype_cout_sousprojet = function(item)
        { 
            var typ_mai = vm.alltype_cout_sousprojet.filter(function(obj)
            {
                return obj.id == item.id_type_cout_sousprojet;
            });
            item.cout = parseInt(typ_mai[0].cout_sousprojet);
            
        };

/***********************************fin cout sousprojet**************************************/

      /*****************debut convention detail**************/

      //col table
        vm.convention_cife_detail_column1 = [
        {
          titre:"Intitule"
        },
        {
          titre:"Delai"
        },
        {
          titre:"Prévision bénéficiaire"
        },
        {
          titre:"Prévision nombre école"
        },
        {
          titre:"Date signature"
        },
        {
          titre:"Observation"
        }];

        vm.convention_cife_detail_column2 = [
        {
          titre:"Nom banque"
        },
        {
          titre:"Adresse banque"
        },
        {
          titre:"RIB"
        }];


        //fonction selection item detail convention cisco/feffi
        vm.selectionDetail = function (item)
        {
            vm.selectedItemDetail = item;
            
           // vm.allconvention= [] ;             

        };
        $scope.$watch('vm.selectedItemDetail', function()
        {
             if (!vm.allconvention_cife_detail) return;
             vm.allconvention_cife_detail.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDetail.$selected = true;
        });

   vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"Nombre salle"
        },
        {
          titre:"Cout unitaire"
        }];
        //fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;         

        };
        $scope.$watch('vm.selectedItemBatiment_construction', function()
        {
             if (!vm.allbatiment_construction) return;
             vm.allbatiment_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBatiment_construction.$selected = true;
        });

        /*****************fin batiment construction***************/


       /*****************debut latrine construction***************/
      //col table
        vm.latrine_construction_column1 = [        
        {
          titre:"Latrine"
        },
        {
          titre:"Nombre boxe latrine"
        },
        {
          titre:"Nombre point d'eau"
        },
        {
          titre:"cout latrine"
        }];

             //fonction selection item Latrine construction cisco/feffi
        vm.selectionLatrine_construction = function (item)
        {
            vm.selectedItemLatrine_construction = item;         

        };
        $scope.$watch('vm.selectedItemLatrine_construction', function()
        {
             if (!vm.alllatrine_construction) return;
             vm.alllatrine_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemLatrine_construction.$selected = true;
        });

     
      /*****************fin latrine construction***************/

      /*****************debut mobilier construction***************/
       //col table
        vm.mobilier_construction_column = [        
        {
          titre:"Mobilier"
        },
        {
          titre:"Nombre table banc"
        },
        {
          titre:"Nombre table maitre"
        },
        {
          titre:"Nombre chaise maitre"
        },
        {
          titre:"Cout mobilier"
        }];

             //fonction selection item Mobilier construction cisco/feffi
        vm.selectionMobilier_construction = function (item)
        {
            
            vm.selectedItemMobilier_construction = item;
           
           // vm.allconvention= [] ;
        };
        $scope.$watch('vm.selectedItemMobilier_construction', function()
        {
             if (!vm.allmobilier_construction) return;
             vm.allmobilier_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMobilier_construction.$selected = true;
        });

      /*****************fin mobilier construction***************/

      

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
    }
})();
