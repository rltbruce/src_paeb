(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi_valide')
        .controller('Convention_cisco_feffi_valideController', Convention_cisco_feffi_valideController);
    /** @ngInject */
    function Convention_cisco_feffi_valideController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
    
        var vm    = this;
        var NouvelItemTete = false;
        var currentItemTete;
        vm.allfeffi = [];



        vm.date_now         = new Date();
        vm.allcisco         = [] ;
        vm.selectedItemTete = {} ;

        vm.selectedItem_cout_maitrise = {} ;
        vm.selectedItem_cout_sousprojet = {} ;

        vm.selectedItemTete.$selected=false;
        vm.allconvention_cife_tete  = [] ;
        vm.allcompte_feffi = [];

        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.stepFor           = false;

        vm.selectedItemDetail = {} ;

        vm.allconvention_cife_detail  = [] ;
        vm.showbuttonNouvDetail=true;


        //vm.allattachement_batiment  = [] ;
        vm.alltype_batiment  = [] ;

        vm.selectedItemBatiment_construction = {} ;
        vm.selectedItemBatiment_construction.$selected=false;
        vm.allbatiment_construction  = [] ;

        //vm.allattachement_latrine  = [] ;
        vm.alltype_latrine  = [] ;


        vm.selectedItemLatrine_construction = {} ;
        vm.selectedItemLatrine_construction.$selected=false;
        vm.alllatrine_construction  = [] ;        

        //vm.allattachement_mobilier  = [] ;
        vm.alltype_mobilier  = [] ;

        vm.selectedItemMobilier_construction = {} ;
        vm.selectedItemMobilier_construction.$selected=false;
        vm.allmobilier_construction  = [] ;
        vm.showbuttonNouvMobilier=true;
        vm.showbuttonNouvBatiment=true;
        vm.showbuttonNouvLatrine=true;
        vm.showbuttonNouvMobilier=true;

        vm.afficherboutonValider = false;
        vm.permissionboutonValider = false;
        //vm.usercisco = [];
      /*****fin initialisation*****/

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //style
        vm.dtOptionsperso = {
          dom: '<"top">rt<"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        
        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          vm.allcisco.push(usercisco);
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention_cife_tete = result.data.response; 
                console.log(vm.allconvention_cife_tete);
            });
          }
          

        });

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
      /*****************debut convention entete***************/

        //col table
        vm.convention_cife_tete_column = [
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
        
        //recuperation donnée type_cout_divers
        apiFactory.getAll("type_cout_divers/index").then(function(result)
        {
          vm.all_type_cout_divers= result.data.response;
        });      

        //fonction selection item entete convention cisco/feffi
        vm.selectionTete = function (item)
        {
            vm.selectedItemTete = item;
            if(item.$selected==false)
            {
              currentItemTete     = JSON.parse(JSON.stringify(vm.selectedItemTete));
            }
            
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvDetail=true;
            vm.showbuttonNouvBatiment=true;
            //recuperation donnée convention
           if (vm.selectedItemTete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.allconvention_cife_detail = result.data.response;

                  if (vm.allconvention_cife_detail.length!=0)
                  {
                    vm.showbuttonNouvDetail=false;
                  } 
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
                vm.all_cout_maitrise = result.data.response;
                console.log(vm.all_cout_maitrise);
               
              });
              apiFactory.getAPIgeneraliserREST("cout_sousprojet_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                vm.all_cout_sousprojet = result.data.response;
                console.log(vm.all_cout_sousprojet);
               
              });
              //recuperation donnée convention
           
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;

                  if (vm.allbatiment_construction.length >0)
                  {                    
                    vm.showbuttonNouvBatiment=false;
                  } 
                  console.log(vm.allbatiment_construction);
              });

              //recuperation donnée batiment ouvrage
              apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getbatimentByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_batiment = result.data.response;
                console.log(vm.alltype_batiment);
              });

              /*vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;*/
              vm.afficherboutonValider = true;
              //Fin Récupération cout divers par convention
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
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
      
      /*****************fin convention entete***************/

      /*****************debut cout maitrise**************/

      vm.cout_maitrise_column = 
      [        
        {
          titre:"Déscription"
        },
        {
          titre:"Coût"
        }
      ];     

        vm.select_cout_maitrise = function(item)
        {
          vm.selectedItem_cout_maitrise = item ;
          console.log(vm.selectedItem_cout_maitrise);
          if(item.$selected==false)
            {
              current_elem_cout_maitrise     = JSON.parse(JSON.stringify(vm.selectedItem_cout_maitrise));
            }
        }

        $scope.$watch('vm.selectedItem_cout_maitrise', function()
        {
             if (!vm.all_cout_maitrise) return;
             vm.all_cout_maitrise.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_cout_maitrise.$selected = true;
        });
      /*****************fin cout divers**************/

      /*****************debut cout divers**************/

      vm.cout_sousprojet_column = 
      [        
        {
          titre:"Déscription"
        },
        {
          titre:"Coût"
        }
      ];     

        vm.select_cout_sousprojet = function(item)
        {
          vm.selectedItem_cout_sousprojet = item ;
          console.log(vm.selectedItem_cout_sousprojet);
          if(item.$selected==false)
            {
              current_elem_cout_sousprojet     = JSON.parse(JSON.stringify(vm.selectedItem_cout_sousprojet));
            }
        }

        $scope.$watch('vm.selectedItem_cout_sousprojet', function()
        {
             if (!vm.all_cout_sousprojet) return;
             vm.all_cout_sousprojet.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_cout_sousprojet.$selected = true;
        });
      /*****************fin cout sousprojet**************/
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

            if(item.$selected==false)
            {
              currentItemDetail     = JSON.parse(JSON.stringify(vm.selectedItemDetail));
            }
            
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

          
      /*****************fin convention detail****************/

      /*****************debut batiment construction***************/
      //col table

        vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"Description"
        },
        {
          titre:"Nombre salle"
        },
       // {
        //  titre:"Nombre batiment"
        //},
        {
          titre:"Cout unitaire"
        }];

        //fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;

            if(item.$selected==false)
            {
               currentItemBatiment_construction     = JSON.parse(JSON.stringify(vm.selectedItemBatiment_construction));
            }
           vm.showbuttonNouvLatrine=true;
           // vm.allconvention= [] ;          
            //recuperation donnée convention
            if (vm.selectedItemBatiment_construction.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;

                  if (vm.alllatrine_construction.length >0)
                  {
                    vm.showbuttonNouvLatrine=false;
                  }
                console.log(vm.alllatrine_construction);
                  
              });

              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  if(vm.allmobilier_construction.length!=0)
                  {
                    vm.showbuttonNouvMobilier=false;
                  }
                  
              });

              apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                  vm.alltype_latrine = result.data.response; 
                  //console.log(vm.alltype_latrine);
              });

              apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                  vm.alltype_mobilier = result.data.response; 
                  //console.log(vm.alltype_mobilier);
              });
              vm.stepThree = true;
              vm.stepFor = false;
            }           

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
        /*{
          titre:"Nombre latrine"
        },
        */
        {
          titre:"Description"
        }];

         vm.latrine_construction_column2 = [        
        
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

            if (item.$selected==false)
            {
               currentItemLatrine_construction     = JSON.parse(JSON.stringify(vm.selectedItemLatrine_construction));
            }           

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
        vm.mobilier_construction_column1 = [        
        {
          titre:"Mobilier"
        },
       /* {
          titre:"Nombre mobilier"
        },*/
        {
          titre:"Description"
        }];

        //col table
        vm.mobilier_construction_column2 = [        
        
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
          titre:"cout mobilier"
        }];

        //fonction selection item Mobilier construction cisco/feffi
        vm.selectionMobilier_construction = function (item)
        {
            
            vm.selectedItemMobilier_construction = item;

            if(item.$selected == false)
            {
               currentItemMobilier_construction     = JSON.parse(JSON.stringify(vm.selectedItemMobilier_construction));
            }
           
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
