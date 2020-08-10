
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
          vm.showbuttonfiltre=false;
          vm.showfiltre=true;
        }
        vm.showformfiltreimporter = function()
        {
          vm.showbuttonfiltreimporter=false;
          vm.showformimporter=true;
          $scope.uploadFile ="";
          angular.element("#fichier").value = "";
        }
         $scope.uploadFile = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
        }
        vm.annulerfiltreimporter = function()
        {
            vm.fichier = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonfiltreimporter=true;
            vm.showformimporter=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importerconvention = function (item,suppression) {
          var file =vm.myFile[0];
          var repertoire = 'importerconvention/';
          var uploadUrl = apiUrl + "importer_convention/importerdonneeconvention";
          var name = vm.myFile[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier=data["nom_fichier"];
              vm.repertoire=data["repertoire"];
              if(data.erreur==true) {
               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé inserer: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importerconvention/"+data.nomFile;
                    vm.allconvention_cife_tete = data.convention_inserer;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                vm.allconvention_cife_tete = result.data.response;
                 console.log(vm.allconvention_cife_tete);
            });
            
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
            vm.showbuttonfiltre=true;
            vm.showfiltre=false;
        }

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
        vm.filtre_change_ecole = function(item)
        { 
            vm.filtre.id_convention_entete_entete = null;
            if (item.id_ecole != '*')
            {
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventioninvalideByecole","id_ecole",item.id_ecole).then(function(result)
                  {
                    vm.convention_cisco_feffi_entetes = result.data.response;
                    console.log(vm.convention_cisco_feffi_entetes );
                  }, function error(result){ alert('something went wrong')});
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
           if (item.id!=0)
            { 
              if (item.$edit==false || item.$edit==undefined)
              { 
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
                  {
                      vm.allconvention_cife_detail = result.data.response;
                  });
                  apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
                  {
                    vm.allcompte_feffi = result.data.response;
                   
                  });


                  apiFactory.getAPIgeneraliserREST("cout_maitrise_construction/index",'id_convention_entete',item.id).then(function(result)
                  {
                    vm.allcout_maitrise_construction = result.data.response;
                   
                  });
                  apiFactory.getAPIgeneraliserREST("cout_sousprojet_construction/index",'id_convention_entete',item.id).then(function(result)
                  {
                    vm.allcout_sousprojet_construction = result.data.response;
                   
                  });
               
                  apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
                  {
                      vm.allbatiment_construction = result.data.response;

                      if (vm.allbatiment_construction.length >0)
                      {                    
                        vm.showbuttonNouvBatiment=false;
                      } 
                  });

                  apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
                  {
                      vm.alllatrine_construction = result.data.response;

                      if (vm.alllatrine_construction.length >0)
                      {                    
                        vm.showbuttonNouvLatrine=false;
                      } 
                  });


                  apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
                  {
                      vm.allmobilier_construction = result.data.response;

                      if (vm.allmobilier_construction.length >0)
                      {                    
                        vm.showbuttonNouvMobilier=false;
                      } 
                  });

                  apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getbatimentByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone_subvention,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces_zone).then(function(result)
                  {
                    vm.alltype_batiment = result.data.response;
                  });

                  apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone_subvention,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces_zone).then(function(result)
                  {
                    vm.alltype_latrine = result.data.response;
                  });

                  apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone_subvention,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces_zone).then(function(result)
                  {
                    vm.alltype_mobilier = result.data.response;
                  });

                  apiFactory.getAPIgeneraliserREST("type_cout_maitrise/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone_subvention,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces_zone).then(function(result)
                  {
                    vm.alltype_cout_maitrise = result.data.response;
                  });
                  apiFactory.getAPIgeneraliserREST("type_cout_sousprojet/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone_subvention,
                    'id_acces_zone',vm.selectedItemTete.ecole.id_acces_zone).then(function(result)
                  {
                    vm.alltype_cout_sousprojet = result.data.response;
                  });

                  vm.stepOne = true;
                  vm.stepTwo = false;
                  vm.stepThree = false;
              }
              
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
    }
})();