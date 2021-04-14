
(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_cisco_feffi_etat')
        .directive('customOnChange', function() {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChange);
          element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          ngModel.$setViewValue(files);
        });
        }
      };
    })
    .service('fileUpload', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        var rep='test';
        fd.append('file', file);
        $http.post(uploadUrl, fd,{
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).success(function(){
           console.log('tafa');
        }).error(function(){
           console.log('Rivotra');
        });
      }
    }])
        .controller('Convention_cisco_feffi_etatController', Convention_cisco_feffi_etatController);
    /** @ngInject */
    function Convention_cisco_feffi_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.allfeffi = [];
        vm.allsite = [];
        
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

        vm.selectedItemcout_maitrise_construction = {} ;

        vm.selectedItemcout_sousprojet_construction = {} ;

        vm.allcisco         = [] ;
        vm.selectedItemTete = {} ;
        vm.allconvention_cife_tete  = [] ;
        vm.allcompte_feffi = [];

        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.stepFor           = false;

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
        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        
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
        vm.date_now         = new Date();
        var id_user = $cookieStore.get('id');
        var annee = vm.date_now.getFullYear();
        
        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        });

/********************************Debut get convention entete by cisco***********************************/

        
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
            
            /*apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalidedaafBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                vm.allconvention_cife_tete = result.data.response;
                 console.log(vm.allconvention_cife_tete);
            });*/
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalidedaafBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_cife_tete = result.data.response;
                vm.affiche_load =false;
            });
            
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
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index","menu","getzapBycommune","id_commune",item.id_commune).then(function(result)
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

/********************************Fin get convention entete by cisco***********************************/


/**********************************Debut convention entete******************************************/

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
        },
        {titre:"Situation"
        }];
        
        
        //fonction selection item entete convention cisco/feffi
        vm.selectionTete = function (item)
        {
            vm.selectedItemTete = item; 
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
            vm.header_ref_convention = item.ref_convention;
              vm.header_cisco = item.cisco.description;
              vm.header_feffi = item.feffi.denomination; 
              vm.header_class = 'headerbig';
             
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
        vm.affichage_situation = function(validation)
        { 
          var affichage = 'En préparation';
          if(validation == 2)
          {
            affichage = 'En cours de traitement';
          }
          return affichage;
        }
        vm.step_menu_detail = function()
        {
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
          {
              vm.allconvention_cife_detail = result.data.response;
          });

        }
        vm.step_menu_cout_maitrise = function()
        {
          apiFactory.getAPIgeneraliserREST("cout_maitrise_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
          {
            vm.allcout_maitrise_construction = result.data.response;
           
          });
          
        }
        vm.step_menu_cout_sousprojet = function()
        {
          apiFactory.getAPIgeneraliserREST("cout_sousprojet_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
          {
            vm.allcout_sousprojet_construction = result.data.response;
           
          });
          
        }
        vm.step_menu_batiment = function()
        {
          apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
          {
              vm.allbatiment_construction = result.data.response;
          });
          
        }
        vm.step_menu_latrine = function()
        {
          apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
          {
              vm.alllatrine_construction = result.data.response; 
          });
          
        }
        vm.step_menu_mobilier = function()
        {
          apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
          {
              vm.allmobilier_construction = result.data.response; 
          });
          
        }

/**********************************fin convention entete***********************************/


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
          titre:"Intitule"
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
