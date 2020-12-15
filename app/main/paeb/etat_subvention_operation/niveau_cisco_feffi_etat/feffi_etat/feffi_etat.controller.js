(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.feffi_etat')
        .controller('Feffi_etatController', Feffi_etatController);
    /** @ngInject */
    function Feffi_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
		    var vm = this;

        vm.selectedItemecole = {} ;
        vm.allecole = [] ;

        vm.selectedItem = {} ;
        vm.allfeffi = [] ;

        vm.nouveaubuttonfeffi = true;

        vm.selectedItemMembre = {} ;
        vm.allmembre = [] ;

        vm.selectedItemCompte_feffi = {} ;
        vm.allcompte_feffi = [] ;

        vm.selectedItemMembre_titulaire = {} ;
        vm.allmembre_titulaire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        vm.filtre ={};
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/
      //col table
        vm.ecole_column = [
        {titre:"Code"
        },
        {titre:"Denomination"
        },
        {titre:"Cisco"
        },
        {titre:"Commune"
        },
        {titre:"Zap"
        },
        {titre:"Fokontany"
        },
        {titre:"Village"
        },
        {titre:"Latitude"
        },
        {titre:"Longitude"
        },
        {titre:"Altitude"
        },
        {titre:"Type zone"
        },
        {titre:"Acces zone"
        }];
        //col table
        vm.feffi_column = [
          {titre:"Identifiant"},
          {titre:"Dénomination"},
          {titre:"Nombre feminin"},
          {titre:"Nombre membre"},
          {titre:"Adresse"},
          {titre:"Observation"}];



        vm.showformfiltre = function()
        {
          //vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
          console.log(vm.showfiltre);
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
        
        
          var id_user = $cookieStore.get('id');

        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
          console.log(vm.regions);
        });

         vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
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
              });
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index","getzap_communeBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
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
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }

        vm.recherchefiltre = function(filtre)
        {
            apiFactory.getAPIgeneraliserREST("ecole/index",'menus',
              'getecoleByfiltre','id_region',filtre.id_region,'id_cisco',
              filtre.id_cisco,'id_commune',filtre.id_commune,'id_zap',filtre.id_zap,'id_ecole',filtre.id_ecole).then(function(result)
              {
                  vm.allecole = result.data.response;
              });
        }

        vm.selectionecole = function (item)
        {
            vm.selectedItemecole = item;
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
            vm.stepFor = false;
           //console.log(item); 
        };
        $scope.$watch('vm.selectedItemecole', function()
        {
             if (!vm.allecole) return;
             vm.allecole.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemecole.$selected = true;
        });

        vm.step_menu_feffi = function()
        {
          
          vm.stepTwo = false;
          vm.stepThree = false;
          vm.stepFor = false;
          apiFactory.getAPIgeneraliserREST("feffi/index","id_ecole",vm.selectedItemecole.id).then(function(result)
          {
            vm.allfeffi = result.data.response;
          });
        }
        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;              
              
              //vm.stepOne = true;
              //vm.stepTwo = false;

              vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;
            
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allfeffi) return;
             vm.allfeffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        
/**********************************fin feffi****************************************/

/**********************************debut membre****************************************/

              vm.step_menu_membre = function()
              {
                //recuperation donnée membre
                apiFactory.getAPIgeneraliserREST("membre_feffi/index",'id_feffi',vm.selectedItem.id).then(function(result)
                {
                    vm.allmembre = result.data.response; 
                    console.log( vm.allmembre);
                });
              }
              
              vm.step_menu_compte = function()
              {//recuperation donnée compte
                
                vm.stepThree = false;
                apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',vm.selectedItem.id).then(function(result)
                {
                    vm.allcompte_feffi = result.data.response; 
                    console.log(vm.allcompte_feffi);
                });
              }
//col table
        vm.membre_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Age"},
        {titre:"Occupation"}]; 

       
        //fonction selection item region
        vm.selectionMembre= function (item)
        {
            vm.selectedItemMembre = item; 
        };
        $scope.$watch('vm.selectedItemMembre', function()
        {
             if (!vm.allmembre) return;
             vm.allmembre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMembre.$selected = true;
        });

        
        /**********************************debut compte****************************************/
        //col table
        vm.compte_feffi_column = [
        {titre:"Nom banque"},
        {titre:"Adresse banque"},
        {titre:"RIB"},
        {titre:"Numero compte"}]; 

               //fonction selection item region
        vm.selectionCompte_feffi= function (item)
        {
            vm.selectedItemCompte_feffi = item;
                //vm.stepTwo = true;
                vm.stepThree = true;
                vm.stepFor = false;
             
        };
        $scope.$watch('vm.selectedItemCompte_feffi', function()
        {
             if (!vm.allcompte_feffi) return;
             vm.allcompte_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemCompte_feffi.$selected = true;
        }); 
        vm.step_menu_membre_titulaire = function()
              {
                apiFactory.getAPIgeneraliserREST("membre_titulaire/index",'id_compte',vm.selectedItemCompte_feffi.id).then(function(result)
                {
                    vm.allmembre_titulaire = result.data.response; 
                    console.log( vm.allmembre_titulaire);
                });
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

        vm.affichage_occupation= function (sexe)
        { var affiche='';
          switch (sexe)
          {
            case '1':
                affiche= 'President';
                break;
            case '2':
                affiche= 'Secretaire';
                break;
            case '3':
                affiche= 'Simple membre';
                break;
            default:
          }
          return affiche;
        };
/**********************************fin membre****************************************/


        /**********************************debut compte titulaire****************************************/
        vm.membre_titulaire_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Occupation"}]; 

        
        //fonction selection item region
        vm.selectionMembre_titulaire= function (item)
        {
            vm.selectedItemMembre_titulaire = item;
        };
        $scope.$watch('vm.selectedItemMembre_titulaire', function()
        {
             if (!vm.allmembre_titulaire) return;
             vm.allmembre_titulaire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMembre_titulaire.$selected = true;
        });

/**********************************fin membre_titulaire****************************************/        

    }
})();
