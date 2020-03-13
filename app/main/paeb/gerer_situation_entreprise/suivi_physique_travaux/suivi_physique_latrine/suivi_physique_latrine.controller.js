(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_latrine')
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
              })
              }
            };
          })
        .directive('fileModel', ['$parse', function ($parse) {
          return {
            restrict: 'A',
            link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;        
              element.bind('change', function(){
                scope.$apply(function(){
                  //modelSetter(scope, element[0].files[0]);
                   //console.log(element[0].files[0]);

                });
              });
            }
          };
        }])
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
        .controller('Suivi_physique_latrineController', Suivi_physique_latrineController);
    /** @ngInject */
    function Suivi_physique_latrineController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        //vm.ajoutContrat_prestataire = ajoutContrat_prestataire ;
        //var NouvelItemContrat_prestataire=false;
        //var currentItemContrat_prestataire;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.selectedItemConvention_detail = {} ;
        vm.allconvention_detail = [] ;

       
        vm.selectedItemBatiment_construction = {} ;
        vm.allbatiment_construction  = [] ;

        var NouvelItemAvenant_prestataire=false;
        var currentItemAvenant_prestataire;
        vm.selectedItemAvenant_prestataire = {} ;
        vm.allavenant_prestataire = [] ;

        vm.allprestataire = [] ;

        /*vm.ajoutAvancement_batiment = ajoutAvancement_batiment ;
        var NouvelItemAvancement_batiment=false;
        var currentItemAvancement_batiment;
        vm.selectedItemAvancement_batiment = {} ;
        vm.allavancement_batiment = [] ;
        vm.allattachement_batiment = [] ;
        vm.allcurrentattachement_batiment = [] ;*/

        /*vm.ajoutAvancement_batiment_doc = ajoutAvancement_batiment_doc ;
        var NouvelItemAvancement_batiment_doc=false;
        var currentItemAvancement_batiment_doc;
        vm.selectedItemAvancement_batiment_doc = {} ;
        vm.allavancement_batiment_doc = [] ;*/

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;

        vm.showbuttonNouvContrat_prestataire=true;
        vm.date_now         = new Date();
        vm.showThParcourir = false;

        vm.selectedItemLatrine_construction = {} ;
        vm.alllatrine_construction  = [] ;

        vm.ajoutAvancement_latrine = ajoutAvancement_latrine ;
        var NouvelItemAvancement_latrine=false;
        var currentItemAvancement_latrine;
        vm.selectedItemAvancement_latrine = {} ;
        vm.allavancement_latrine = [] ;
        vm.allattachement_latrine = [] ;

        vm.ajoutAvancement_latrine_doc = ajoutAvancement_latrine_doc ;
        var NouvelItemAvancement_latrine_doc=false;
        var currentItemAvancement_latrine_doc;
        vm.selectedItemAvancement_latrine_doc = {} ;
        vm.allavancement_latrine_doc = [] ;

        vm.selectedItemMobilier_construction = {} ;
        vm.allmobilier_construction  = [] ;
        vm.ajoutAvancement_mobilier = ajoutAvancement_mobilier ;
        var NouvelItemAvancement_mobilier=false;
        var currentItemAvancement_mobilier;
        vm.selectedItemAvancement_mobilier = {} ;
        vm.allavancement_mobilier = [] ;
        vm.allattachement_mobilier = [] ;

        vm.ajoutAvancement_mobilier_doc = ajoutAvancement_mobilier_doc ;
        var NouvelItemAvancement_mobilier_doc=false;
        var currentItemAvancement_mobilier_doc;
        vm.selectedItemAvancement_mobilier_doc = {} ;
        vm.allavancement_mobilier_doc = [] ;


        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
 
/**********************************fin contrat prestataire****************************************/
        //col table
        vm.contrat_prestataire_column = [
        {titre:"Prestataire"
        },
        {titre:"Description"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        },
        {titre:"Date prévisionnelle"
        },
        {titre:"Date réel"
        },
        {titre:"Délai éxecution"
        },
        {titre:"Action"
        }];     
        //recuperation donnée convention
        apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           // vm.allconvention= [] ;
            
            //vm.showbuttonNouvContrat_prestataire=true;
            //recuperation donnée convention
            if (item.id!=0)
            {
             /* apiFactory.getOne("convention_cisco_feffi_entete/index",item.convention_entete.id).then(function(result)
              {
                  vm.allconvention_entete = result.data.response;
                  console.log(vm.allconvention_entete);
              });*/
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'menu','getbatimentByContrat_prestataire','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;
                  console.log(vm.allbatiment_construction);
              });

              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'menu','getlatrineByContrat_prestataire','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                  console.log(vm.alllatrine_construction);
                  
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
              
            }           

        };
        $scope.$watch('vm.selectedItemContrat_prestataire', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allcontrat_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_prestataire.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

      /*****************debut latrine construction***************/
      //col table
        vm.latrine_construction_column = [        
        {
          titre:"Latrine"
        },
        {
          titre:"Nombre latrine"
        },
        {
          titre:"cout latrine"
        }];

        //fonction selection item Latrine construction cisco/feffi
        vm.selectionLatrine_construction = function (item)
        {
            vm.selectedItemLatrine_construction = item;
            apiFactory.getAPIgeneraliserREST("attachement_latrine/index",'id_type_latrine',vm.selectedItemLatrine_construction.type_latrine.id).then(function(result)
            {
                  vm.allattachement_latrine = result.data.response;
                  vm.allcurrentattachement_latrine = vm.allattachement_latrine;
                  console.log(vm.allattachement_latrine);
                  console.log(vm.allattachement_latrine);
                  
            });
            apiFactory.getAPIgeneraliserREST("avancement_latrine/index",'menu','getavancementBylatrine','id_latrine_construction',vm.selectedItemLatrine_construction.id).then(function(result)
            {
                vm.allavancement_latrine = result.data.response;
                  console.log(vm.allavancement_latrine);
             });
           
             
              vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;
              

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

/**********************************debut avancement latrine****************************************/
//col table
        vm.avancement_latrine_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Date"
        },
        {titre:"Attachement"
        },
        {titre:"Ponderation"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvancement_latrine = function ()
        { 
          if (NouvelItemAvancement_latrine == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              description: '',
              observation: '',
              date: '',
              id_attachement_latrine:'',
              attachement_latrine:{ponderation_latrine: 0}
            };         
            vm.allavancement_latrine.push(items);
            vm.allavancement_latrine.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_latrine = mem;
              }
            });

            NouvelItemAvancement_latrine= true ;

            if (vm.allavancement_latrine.length>1)
            {
              var max_ponderation_latrine = Math.max.apply(Math, vm.allavancement_latrine.map(function(o)
              { 
                    return o.attachement_latrine.ponderation_latrine;
              }));
              vm.allcurrentattachement_latrine = vm.allattachement_latrine.filter(function(obj)
              {
                  return obj.ponderation_latrine > max_ponderation_latrine;
              });console.log(vm.allattachement_latrine);
              console.log(vm.allcurrentattachement_latrine);
            }
          }else
          {
            vm.showAlert('Ajout avancement_latrine','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_latrine(avancement_latrine,suppression)
        {
            if (NouvelItemAvancement_latrine==false)
            {
                test_existanceAvancement_latrine(avancement_latrine,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_latrine(avancement_latrine,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerAvancement_latrine= function(item)
        {
          if (NouvelItemAvancement_latrine == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvancement_latrine.intitule ;
            item.description   = currentItemAvancement_latrine.description ;
            item.observation   = currentItemAvancement_latrine.observation ;
            item.date = currentItemAvancement_latrine.date ;
            item.id_attachement_latrine = currentItemAvancement_latrine.id_attachement_latrine;
            item.ponderation_latrine = currentItemAvancement_latrine.ponderation_latrine ;
           
          }else
          {
            vm.allavancement_latrine = vm.allavancement_latrine.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_latrine.id;
            });
          }

          vm.selectedItemAvancement_latrine = {} ;
          NouvelItemAvancement_latrine      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_latrine= function (item)
        {
            vm.selectedItemAvancement_latrine = item;
            vm.nouvelItemAvancement_latrine   = item;
            currentItemAvancement_latrine    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_latrine));
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_latrine_doc/index",'id_avancement_latrine',vm.selectedItemAvancement_latrine.id).then(function(result)
            {
                vm.allavancement_latrine_doc = result.data.response;
                console.log(vm.allavancement_latrine_doc);
            });           
              
              vm.stepThree = true;
              vm.stepFor = false;
              

           }
             
        };
        $scope.$watch('vm.selectedItemAvancement_latrine', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allavancement_latrine.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_latrine.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_latrine = function(item)
        {
            NouvelItemAvancement_latrine = false ;
            vm.selectedItemAvancement_latrine = item;
            currentItemAvancement_latrine = angular.copy(vm.selectedItemAvancement_latrine);
            $scope.vm.allavancement_latrine.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvancement_latrine.intitule ;
            item.description   = vm.selectedItemAvancement_latrine.description ;
            item.observation   = vm.selectedItemAvancement_latrine.observation;
            item.date = new Date(vm.selectedItemAvancement_latrine.date);
            item.id_attachement_latrine = vm.selectedItemAvancement_latrine.attachement_latrine.id;
            item.ponderation_latrine = parseInt(vm.selectedItemAvancement_latrine.attachement_latrine.ponderation_latrine);

            var allattachement_latrine_autre = vm.allattachement_latrine.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_latrine.attachement_latrine.id;
            });

            var allavancement_latrine_autre = vm.allavancement_latrine.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_latrine.id;
            });

            //if (vm.allavancement_latrine.length>1)
           // {
              var max_ponderation_latrine = Math.max.apply(Math, allavancement_latrine_autre.map(function(o)
              { 
                return o.attachement_latrine.ponderation_latrine;
              }));
            vm.allcurrentattachement_latrine = allattachement_latrine_autre.filter(function(obj)
            {
                return obj.ponderation_latrine > max_ponderation_latrine;
            });
            vm.allcurrentattachement_latrine.push(vm.selectedItemAvancement_latrine.attachement_batiment);
           
        };

        //fonction bouton suppression item avancement_latrine
        vm.supprimerAvancement_latrine = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutAvancement_latrine(vm.selectedItemAvancement_latrine,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Avancement_latrinee
        function test_existanceAvancement_latrine (item,suppression)
        {          
            if (suppression!=1)
            {
               var avanc = vm.allavancement_latrine.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_latrine.id;
                });
                if(avanc[0])
                {
                   if((avanc[0].intitule   != currentItemAvancement_latrine.intitule )
                    || (avanc[0].description  != currentItemAvancement_latrine.description)
                    || (avanc[0].observation   != currentItemAvancement_latrine.observation )
                    || (avanc[0].date != currentItemAvancement_latrine.date )
                    || (avanc[0].id_attachement_latrine != currentItemAvancement_latrine.id_attachement_latrine))                   
                      { 
                         insert_in_baseAvancement_latrine(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_latrine(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvancement_latrine(avancement_latrine,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_latrine==false)
            {
                getId = vm.selectedItemAvancement_latrine.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avancement_latrine.intitule,
                    description: avancement_latrine.description,
                    observation: avancement_latrine.observation,
                    date: convertionDate(new Date(avancement_latrine.date)),
                    id_attachement_latrine:avancement_latrine.id_attachement_latrine,
                    id_latrine_construction: vm.selectedItemLatrine_construction.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_latrine/index",datas, config).success(function (data)
            {   
                var attac= vm.allattachement_latrine.filter(function(obj)
                {
                    return obj.id == avancement_latrine.id_attachement_latrine;
                });
console.log(attac[0]);
var length_bat = vm.allbatiment_construction.length;
                var length_lat = vm.alllatrine_construction.length;
                var length_mob = vm.allmobilier_construction.length;
                var length_total = length_bat+length_lat+length_mob;
                var avancement_total=0;
                if (NouvelItemAvancement_latrine == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemAvancement_latrine.attachement_latrine = attac[0];
                        
                        vm.selectedItemAvancement_latrine.$selected  = false;
                        vm.selectedItemAvancement_latrine.$edit      = false;
                        vm.selectedItemAvancement_latrine ={};
                        vm.showbuttonNouvAvancement_latrine= false;
                       /*  var ponderation_ancien= parseInt(currentItemAvancement_latrine.attachement_latrine.ponderation_latrine);
                        var ponderation_nouve= parseInt(attac[0].ponderation_latrine);
                        avancement_total= ((parseInt(vm.selectedItemConvention_detail.avancement)*length_total)-ponderation_ancien+ponderation_nouve)/length_total;
                        miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
                       
                    }
                    else 
                    {    
                      vm.allavancement_latrine = vm.allavancement_latrine.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvancement_latrine.id;
                      });
                      vm.showbuttonNouvAvancement_latrine= true;
                     /* max_ponderation = Math.max.apply(Math, vm.allavancement_latrine.map(function(o)
                      { 
                        return o.attachement_latrine.ponderation_latrine;
                      }));

                      avancement_total= ((parseInt(vm.selectedItemConvention_detail.avancement)*length_total)-vm.selectedItemAvancement_latrine.ponderation_latrine+max_ponderation)/length_total;
                      
                      miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
                     
                    }
                    
                }
                else
                {
                  avancement_latrine.intitule   = avancement_latrine.intitule ;
                  avancement_latrine.description   = avancement_latrine.description ;
                  avancement_latrine.observation   = avancement_latrine.observation ;
                  avancement_latrine.date = avancement_latrine.date ;
                  avancement_latrine.attachement_latrine = attac[0];

                  avancement_latrine.id  =   String(data.response);              
                  NouvelItemAvancement_latrine=false;
                  vm.showbuttonNouvAvancement_latrine= false;
                 /* var max_ponderation=0;

                  if(vm.allavancement_latrine.length>1)
                  {
                    var allavancement_latrine_encien = vm.allavancement_latrine.filter(function(obj)
                      {
                          return obj.id !== String(data.response);
                      });
                   max_ponderation = Math.max.apply(Math, allavancement_latrine_encien.map(function(o)
                  { 
                    return o.attachement_latrine.ponderation_latrine;
                  }));
                   console.log(max_ponderation);

                  }
                 //var ponderation_ancien= parseInt(currentItemAvancement_batiment.attachement_batiment.ponderation);
                 avancement_total=((parseFloat(vm.selectedItemConvention_detail.avancement)*length_total)- max_ponderation+parseInt(attac[0].ponderation_latrine))/length_total;*/
                 
            }
              avancement_latrine.$selected = false;
              avancement_latrine.$edit = false;
              vm.selectedItemAvancement_latrine = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changeAttachement_latrine= function(item)
        {console.log(vm.allattachement_latrine);
         /* var atta= vm.allattachement_latrine.filtre(function(obj)
          {
            return obj.id==item.id_attachement_latrine;
          });*/
          var atta = vm.allattachement_latrine.filter(function(obj)
          {
              return obj.id == item.id_attachement_latrine;
          });
          item.ponderation_latrine=parseInt(atta[0].ponderation_latrine);
        }
/**********************************fin avancement latrine****************************************/

/**********************************Debut rapport avancement batiment****************************************/

//col table
        vm.avancement_latrine_doc_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFileAvancement_latrine_doc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemAvancement_latrine_doc.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterAvancement_latrine_doc = function ()
        { 
          if (NouvelItemAvancement_latrine_doc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.allavancement_latrine_doc.push(items);
            vm.allavancement_latrine_doc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_latrine_doc = mem;
              }
            });

            NouvelItemAvancement_latrine_doc = true ;
            vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport avancement','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_latrine_doc(avancement_latrine_doc,suppression)
        {
            if (NouvelItemAvancement_latrine_doc==false)
            {
                test_existanceAvancement_latrine_doc (avancement_latrine_doc,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_latrine_doc(avancement_latrine_doc,suppression);
            }
        }

        //fonction de bouton d'annulation avancement_latrine_doc
        vm.annulerAvancement_latrine_doc = function(item)
        {
          if (NouvelItemAvancement_latrine_doc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvancement_latrine_doc.description ;
            item.fichier   = currentItemAvancement_latrine_doc.fichier ;
          }else
          {
            vm.allavancement_latrine_doc = vm.allavancement_latrine_doc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_latrine_doc.id;
            });
          }

          vm.selectedItemAvancement_latrine_doc = {} ;
          NouvelItemAvancement_latrine_doc      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_latrine_doc= function (item)
        {
            vm.selectedItemAvancement_latrine_doc = item;
            vm.nouvelItemAvancement_latrine_doc   = item;
            currentItemAvancement_latrine_doc    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_latrine_doc));

            vm.stepNine = true;
            vm.stepTen = false; 
        };
        $scope.$watch('vm.selectedItemAvancement_latrine_doc', function()
        {
             if (!vm.allavancement_latrine_doc) return;
             vm.allavancement_latrine_doc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_latrine_doc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_latrine_doc = function(item)
        {
            NouvelItemAvancement_latrine_doc = false ;
            vm.selectedItemAvancement_latrine_doc = item;
            currentItemAvancement_latrine_doc = angular.copy(vm.selectedItemAvancement_latrine_doc);
            $scope.vm.allavancement_latrine_doc.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemAvancement_latrine_doc.description ;
            item.fichier   = vm.selectedItemAvancement_latrine_doc.fichier ;
            vm.showThParcourir = true;
        };

        //fonction bouton suppression item avancement_latrine_doc
        vm.supprimerAvancement_latrine_doc = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.avancement_latrine_doc(vm.selectedItemAvancement_latrine_doc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvancement_latrine_doc (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allavancement_latrine_doc.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_latrine_doc.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemAvancement_latrine_doc.description )
                    ||(just[0].fichier   != currentItemAvancement_latrine_doc.fichier ))                   
                      { 
                         insert_in_baseAvancement_latrine_doc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_latrine_doc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd avancement_latrine_doc
        function insert_in_baseAvancement_latrine_doc(avancement_latrine_doc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_latrine_doc==false)
            {
                getId = vm.selectedItemAvancement_latrine_doc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avancement_latrine_doc.description,
                    fichier: avancement_latrine_doc.fichier,
                    id_avancement_latrine: vm.selectedItemAvancement_latrine.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_latrine_doc/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'avancement_latrine_doc/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemAvancement_latrine_doc==false)
                {
                    getIdFile = vm.selectedItemAvancement_latrine_doc.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_rapport_avancement' ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          avancement_latrine_doc.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: avancement_latrine_doc.description,
                              fichier: avancement_latrine_doc.fichier,
                              id_avancement_latrine: vm.selectedItemAvancement_latrine.id               
                          });
                            apiFactory.add("avancement_latrine_doc/index",datas, config).success(function (data)
                            {
                              if (NouvelItemAvancement_latrine_doc == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemAvancement_latrine_doc.description = avancement_latrine_doc.description;
                                      vm.selectedItemAvancement_latrine_doc.fichier = avancement_latrine_doc.fichier;
                                      vm.selectedItemAvancement_latrine_doc.$selected  = false;
                                      vm.selectedItemAvancement_latrine_doc.$edit      = false;
                                      vm.selectedItemAvancement_latrine_doc ={};
                                  }
                                  else 
                                  {    
                                    vm.allavancement_latrine_doc = vm.allavancement_latrine_doc.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvancement_latrine_doc.id;
                                    });
                                  }
                              }
                              else
                              {
                                avancement_latrine_doc.description = avancement_latrine_doc.description;
                                avancement_latrine_doc.fichier = avancement_latrine_doc.fichier; 

                                avancement_latrine_doc.id  =   String(data.response);              
                                NouvelItemAvancement_latrine_doc=false;
                          }
                            avancement_latrine_doc.$selected = false;
                            avancement_latrine_doc.$edit = false;
                            vm.selectedItemAvancement_latrine_doc = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        avancement_latrine_doc.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: avancement_latrine_doc.description,
                              fichier: avancement_latrine_doc.fichier,
                              id_avancement_latrine: vm.selectedItemAvancement_latrine.id               
                          });
                        apiFactory.add("avancement_latrine_doc/index",datas, config).success(function (data)
                            {
                              if (NouvelItemAvancement_latrine_doc == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemAvancement_latrine_doc.description = avancement_latrine_doc.description;
                                      vm.selectedItemAvancement_latrine_doc.fichier = avancement_latrine_doc.fichier;
                                      vm.selectedItemAvancement_latrine_doc.$selected  = false;
                                      vm.selectedItemAvancement_latrine_doc.$edit      = false;
                                      vm.selectedItemAvancement_latrine_doc ={};
                                  }
                                  else 
                                  {    
                                    vm.allavancement_latrine_doc = vm.allavancement_latrine_doc.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvancement_latrine_doc.id;
                                    });
                                  }
                              }
                              else
                              {
                                avancement_latrine_doc.description = avancement_latrine_doc.description;
                                avancement_latrine_doc.fichier = avancement_latrine_doc.fichier; 

                                avancement_latrine_doc.id  =   String(data.response);              
                                NouvelItemAvancement_latrine_doc=false;
                          }
                            avancement_latrine_doc.$selected = false;
                            avancement_latrine_doc.$edit = false;
                            vm.selectedItemAvancement_latrine_doc = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin rapport avancement latrine****************************************/


/*****************debut mobilier construction***************/
      //col table
        vm.mobilier_construction_column = [        
        {
          titre:"Mobilier"
        },
        {
          titre:"Nombre mobilier"
        },
        {
          titre:"cout mobilier"
        }];

       
        //fonction selection item Mobilier construction
        vm.selectionMobilier_construction = function (item)
        {
            vm.selectedItemMobilier_construction = item;
           // vm.allconvention= [] ;
           apiFactory.getAPIgeneraliserREST("attachement_mobilier/index",'id_type_mobilier',vm.selectedItemMobilier_construction.type_mobilier.id).then(function(result)
            {
                  vm.allattachement_mobilier = result.data.response;
                  vm.allcurrentattachement_mobilier = result.data.response;
                  console.log(vm.allattachement_mobilier);
                  
            });
           apiFactory.getAPIgeneraliserREST("avancement_mobilier/index",'menu','getavancementBymobilier','id_mobilier_construction',vm.selectedItemMobilier_construction.id).then(function(result)
            {
                vm.allavancement_mobilier = result.data.response;
                  console.log(vm.allavancement_mobilier);
             });
              vm.stepEight = true;
              vm.stepNine = false;
              vm.stepTen = false;
                      

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

/**********************************debut avancement latrine****************************************/
//col table
        vm.avancement_mobilier_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Date"
        },
        {titre:"Attachement"
        },
        {titre:"Ponderation"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvancement_mobilier = function ()
        { 
          if (NouvelItemAvancement_mobilier == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              description: '',
              observation: '',
              date: '',
              id_attachement_mobilier:'',
              attachement_mobilier:{ponderation_mobilier:0}
            };         
            vm.allavancement_mobilier.push(items);
            vm.allavancement_mobilier.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_mobilier = mem;
              }
            });

            NouvelItemAvancement_mobilier= true ;

            if (vm.allavancement_mobilier.length>1)
            {
              var max_ponderation_mobilier = Math.max.apply(Math, vm.allavancement_mobilier.map(function(o)
              { 
                    return o.attachement_mobilier.ponderation_mobilier;
              }));
              vm.allcurrentattachement_mobilier = vm.allattachement_mobilier.filter(function(obj)
              {
                  return obj.ponderation_mobilier > max_ponderation_mobilier;
              });
            }
          }else
          {
            vm.showAlert('Ajout avancement_mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_mobilier(avancement_mobilier,suppression)
        {
            if (NouvelItemAvancement_mobilier==false)
            {
                test_existanceAvancement_mobilier(avancement_mobilier,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_mobilier(avancement_mobilier,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerAvancement_mobilier= function(item)
        {
          if (NouvelItemAvancement_mobilier == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvancement_mobilier.intitule ;
            item.description   = currentItemAvancement_mobilier.description ;
            item.observation   = currentItemAvancement_mobilier.observation ;
            item.date = currentItemAvancement_mobilier.date ;
            item.id_attachement_mobilier = currentItemAvancement_mobilier.id_attachement_mobilier;
            item.ponderation_mobilier = currentItemAvancement_mobilier.ponderation_mobilier ;
           
          }else
          {
            vm.allavancement_mobilier = vm.allavancement_mobilier.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_mobilier.id;
            });
          }

          vm.selectedItemAvancement_mobilier = {} ;
          NouvelItemAvancement_mobilier      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_mobilier= function (item)
        {
            vm.selectedItemAvancement_mobilier = item;
            vm.nouvelItemAvancement_mobilier   = item;
            currentItemAvancement_mobilier    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_mobilier));
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_mobilier_doc/index",'id_avancement_mobilier',vm.selectedItemAvancement_mobilier.id).then(function(result)
            {
                vm.allavancement_mobilier_doc = result.data.response;
                console.log(vm.allavancement_mobilier_doc);
            });
           
              vm.stepNine = true;
              vm.stepTen = false;
              

           }
             
        };
        $scope.$watch('vm.selectedItemAvancement_mobilier', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allavancement_mobilier.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_mobilier.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_mobilier = function(item)
        {
            NouvelItemAvancement_mobilier = false ;
            vm.selectedItemAvancement_mobilier = item;
            currentItemAvancement_mobilier = angular.copy(vm.selectedItemAvancement_mobilier);
            $scope.vm.allavancement_mobilier.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvancement_mobilier.intitule ;
            item.description   = vm.selectedItemAvancement_mobilier.description ;
            item.observation   = vm.selectedItemAvancement_mobilier.observation;
            item.date = new Date(vm.selectedItemAvancement_mobilier.date);
            item.id_attachement_mobilier = vm.selectedItemAvancement_mobilier.attachement_mobilier.id;
            item.ponderation_mobilier = parseInt(vm.selectedItemAvancement_mobilier.attachement_mobilier.ponderation_mobilier);

            var allattachement_mobilier_autre = vm.allattachement_mobilier.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_mobilier.attachement_mobilier.id;
            });

            var allavancement_mobilier_autre = vm.allavancement_mobilier.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_mobilier.id;
            });

            //if (vm.allavancement_mobilier.length>1)
           // {
              var max_ponderation_mobilier = Math.max.apply(Math, allavancement_mobilier_autre.map(function(o)
              { 
                return o.attachement_mobilier.ponderation_mobilier;
              }));
            vm.allcurrentattachement_mobilier = allattachement_mobilier_autre.filter(function(obj)
            {
                return obj.ponderation_mobilier > max_ponderation_mobilier;
            });
            vm.allcurrentattachement_mobilier.push(vm.selectedItemAvancement_mobilier.attachement_mobilier);
           
        };

        //fonction bouton suppression item avancement_mobilier
        vm.supprimerAvancement_mobilier = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutAvancement_mobilier(vm.selectedItemAvancement_mobilier,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Avancement_mobiliere
        function test_existanceAvancement_mobilier (item,suppression)
        {          
            if (suppression!=1)
            {
               var avanc = vm.allavancement_mobilier.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_mobilier.id;
                });
                if(avanc[0])
                {
                   if((avanc[0].intitule   != currentItemAvancement_mobilier.intitule )
                    || (avanc[0].description  != currentItemAvancement_mobilier.description)
                    || (avanc[0].observation   != currentItemAvancement_mobilier.observation )
                    || (avanc[0].date != currentItemAvancement_mobilier.date )
                    || (avanc[0].id_attachement_mobilier != currentItemAvancement_mobilier.id_attachement_mobilier))                   
                      { 
                         insert_in_baseAvancement_mobilier(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_mobilier(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvancement_mobilier(avancement_mobilier,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_mobilier==false)
            {
                getId = vm.selectedItemAvancement_mobilier.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avancement_mobilier.intitule,
                    description: avancement_mobilier.description,
                    observation: avancement_mobilier.observation,
                    date: convertionDate(new Date(avancement_mobilier.date)),
                    id_attachement_mobilier:avancement_mobilier.id_attachement_mobilier,
                    id_mobilier_construction: vm.selectedItemMobilier_construction.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_mobilier/index",datas, config).success(function (data)
            {   
                var attac= vm.allattachement_mobilier.filter(function(obj)
                {
                    return obj.id == avancement_mobilier.id_attachement_mobilier;
                });
console.log(attac[0]);
var length_bat = vm.allbatiment_construction.length;
                var length_lat = vm.alllatrine_construction.length;
                var length_mob = vm.allmobilier_construction.length;
                var length_total = length_bat+length_lat+length_mob;
                var avancement_total=0;
                if (NouvelItemAvancement_mobilier == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemAvancement_mobilier.attachement_mobilier = attac[0];
                        
                        vm.selectedItemAvancement_mobilier.$selected  = false;
                        vm.selectedItemAvancement_mobilier.$edit      = false;
                        vm.selectedItemAvancement_mobilier ={};
                        vm.showbuttonNouvAvancement_mobilier= false;
/*
                         var ponderation_ancien= parseInt(currentItemAvancement_mobilier.attachement_mobilier.ponderation_mobilier);
                        var ponderation_nouve= parseInt(attac[0].ponderation_mobilier);
                        avancement_total= ((parseInt(vm.selectedItemConvention_detail.avancement)*length_total)-ponderation_ancien+ponderation_nouve)/length_total;
                        miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
                    }
                    else 
                    {    
                      vm.allavancement_mobilier = vm.allavancement_mobilier.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvancement_mobilier.id;
                      });
                      vm.showbuttonNouvAvancement_mobilier= true;
                      /* max_ponderation = Math.max.apply(Math, vm.allavancement_mobilier.map(function(o)
                      { 
                        return o.attachement_mobilier.ponderation_mobilier;
                      }));

                      avancement_total= ((parseInt(vm.selectedItemConvention_detail.avancement)*length_total)-vm.selectedItemAvancement_mobilier.ponderation_mobilier+max_ponderation)/length_total;
                     
                      
                      miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
                    }
                    
                }
                else
                {
                  avancement_mobilier.attachement_mobilier = attac[0];

                  avancement_mobilier.id  =   String(data.response);              
                  NouvelItemAvancement_mobilier=false;
                  vm.showbuttonNouvAvancement_mobilier= false;
                  /*var max_ponderation=0;

                  if(vm.allavancement_mobilier.length>1)
                  {
                    var allavancement_mobilier_encien = vm.allavancement_mobilier.filter(function(obj)
                      {
                          return obj.id !== String(data.response);
                      });
                   max_ponderation = Math.max.apply(Math, allavancement_mobilier_encien.map(function(o)
                  { 
                    return o.attachement_mobilier.ponderation_mobilier;
                  }));
                   console.log(max_ponderation);

                  }
                 //var ponderation_ancien= parseInt(currentItemAvancement_mobilier.attachement_mobilier.ponderation);
                 avancement_total=((parseFloat(vm.selectedItemConvention_detail.avancement)*length_total)- max_ponderation+parseInt(attac[0].ponderation_mobilier))/length_total;
                  //avancement_total= (((parseFloat(vm.selectedItemConvention_detail.avancement)*length_total)+parseInt(attac[0].ponderation_batiment))/length_total).toFixe(3);

                  miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
            }
              avancement_mobilier.$selected = false;
              avancement_mobilier.$edit = false;
              vm.selectedItemAvancement_mobilier = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changeAttachement_mobilier= function(item)
        {console.log(vm.allattachement_mobilier);
         /* var atta= vm.allattachement_mobilier.filtre(function(obj)
          {
            return obj.id==item.id_attachement_mobilier;
          });*/
          var atta = vm.allattachement_mobilier.filter(function(obj)
          {
              return obj.id == item.id_attachement_mobilier;
          });
          item.ponderation_mobilier=parseInt(atta[0].ponderation_mobilier);
        }
/**********************************fin avancement mobilier****************************************/

/**********************************Debut rapport avancement batiment****************************************/

//col table
        vm.avancement_mobilier_doc_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFileAvancement_mobilier_doc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemAvancement_mobilier_doc.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterAvancement_mobilier_doc = function ()
        { 
          if (NouvelItemAvancement_mobilier_doc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.allavancement_mobilier_doc.push(items);
            vm.allavancement_mobilier_doc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_mobilier_doc = mem;
              }
            });

            NouvelItemAvancement_mobilier_doc = true ;
            vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport avancement','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_mobilier_doc(avancement_mobilier_doc,suppression)
        {
            if (NouvelItemAvancement_mobilier_doc==false)
            {
                test_existanceAvancement_mobilier_doc (avancement_mobilier_doc,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_mobilier_doc(avancement_mobilier_doc,suppression);
            }
        }

        //fonction de bouton d'annulation avancement_mobilier_doc
        vm.annulerAvancement_mobilier_doc = function(item)
        {
          if (NouvelItemAvancement_mobilier_doc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvancement_mobilier_doc.description ;
            item.fichier   = currentItemAvancement_mobilier_doc.fichier ;
          }else
          {
            vm.allavancement_mobilier_doc = vm.allavancement_mobilier_doc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_mobilier_doc.id;
            });
          }

          vm.selectedItemAvancement_mobilier_doc = {} ;
          NouvelItemAvancement_mobilier_doc      = false;
          vm.showThParcourir = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_mobilier_doc= function (item)
        {
            vm.selectedItemAvancement_mobilier_doc = item;
            vm.nouvelItemAvancement_mobilier_doc   = item;
            currentItemAvancement_mobilier_doc    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_mobilier_doc));

            vm.stepNine = true;
            vm.stepTen = false; 
        };
        $scope.$watch('vm.selectedItemAvancement_mobilier_doc', function()
        {
             if (!vm.allavancement_mobilier_doc) return;
             vm.allavancement_mobilier_doc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_mobilier_doc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_mobilier_doc = function(item)
        {
            vm.showThParcourir = true;
            NouvelItemAvancement_mobilier_doc = false ;
            vm.selectedItemAvancement_mobilier_doc = item;
            currentItemAvancement_mobilier_doc = angular.copy(vm.selectedItemAvancement_mobilier_doc);
            $scope.vm.allavancement_mobilier_doc.forEach(function(avanc) {
              avanc.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemAvancement_mobilier_doc.description ;
            item.fichier   = vm.selectedItemAvancement_mobilier_doc.fichier ;
            
        };

        //fonction bouton suppression item avancement_mobilier_doc
        vm.supprimerAvancement_mobilier_doc = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.avancement_mobilier_doc(vm.selectedItemAvancement_mobilier_doc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvancement_mobilier_doc (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allavancement_mobilier_doc.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_mobilier_doc.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemAvancement_mobilier_doc.description )
                    ||(just[0].fichier   != currentItemAvancement_mobilier_doc.fichier ))                   
                      { 
                         insert_in_baseAvancement_mobilier_doc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_mobilier_doc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd avancement_mobilier_doc
        function insert_in_baseAvancement_mobilier_doc(avancement_mobilier_doc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_mobilier_doc==false)
            {
                getId = vm.selectedItemAvancement_mobilier_doc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avancement_mobilier_doc.description,
                    fichier: avancement_mobilier_doc.fichier,
                    id_avancement_mobilier: vm.selectedItemAvancement_mobilier.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_mobilier_doc/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'avancement_mobilier_doc/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemAvancement_mobilier_doc==false)
                {
                    getIdFile = vm.selectedItemAvancement_mobilier_doc.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_rapport_avancement' ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          avancement_mobilier_doc.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: avancement_mobilier_doc.description,
                              fichier: avancement_mobilier_doc.fichier,
                              id_avancement_mobilier: vm.selectedItemAvancement_mobilier.id               
                          });
                            apiFactory.add("avancement_mobilier_doc/index",datas, config).success(function (data)
                            {
                              if (NouvelItemAvancement_mobilier_doc == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemAvancement_mobilier_doc.description = avancement_mobilier_doc.description;
                                      vm.selectedItemAvancement_mobilier_doc.fichier = avancement_mobilier_doc.fichier;
                                      vm.selectedItemAvancement_mobilier_doc.$selected  = false;
                                      vm.selectedItemAvancement_mobilier_doc.$edit      = false;
                                      vm.selectedItemAvancement_mobilier_doc ={};
                                  }
                                  else 
                                  {    
                                    vm.allavancement_mobilier_doc = vm.allavancement_mobilier_doc.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvancement_mobilier_doc.id;
                                    });
                                  }
                              }
                              else
                              {
                                avancement_mobilier_doc.description = avancement_mobilier_doc.description;
                                avancement_mobilier_doc.fichier = avancement_mobilier_doc.fichier; 

                                avancement_mobilier_doc.id  =   String(data.response);              
                                NouvelItemAvancement_mobilier_doc=false;
                          }
                            avancement_mobilier_doc.$selected = false;
                            avancement_mobilier_doc.$edit = false;
                            vm.selectedItemAvancement_mobilier_doc = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        avancement_mobilier_doc.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: avancement_mobilier_doc.description,
                              fichier: avancement_mobilier_doc.fichier,
                              id_avancement_mobilier: vm.selectedItemAvancement_mobilier.id               
                          });
                        apiFactory.add("avancement_mobilier_doc/index",datas, config).success(function (data)
                            {
                              if (NouvelItemAvancement_mobilier_doc == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemAvancement_mobilier_doc.description = avancement_mobilier_doc.description;
                                      vm.selectedItemAvancement_mobilier_doc.fichier = avancement_mobilier_doc.fichier;
                                      vm.selectedItemAvancement_mobilier_doc.$selected  = false;
                                      vm.selectedItemAvancement_mobilier_doc.$edit      = false;
                                      vm.selectedItemAvancement_mobilier_doc ={};
                                  }
                                  else 
                                  {    
                                    vm.allavancement_mobilier_doc = vm.allavancement_mobilier_doc.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvancement_mobilier_doc.id;
                                    });
                                  }
                              }
                              else
                              {
                                avancement_mobilier_doc.description = avancement_mobilier_doc.description;
                                avancement_mobilier_doc.fichier = avancement_mobilier_doc.fichier; 

                                avancement_mobilier_doc.id  =   String(data.response);              
                                NouvelItemAvancement_mobilier_doc=false;
                          }
                            avancement_mobilier_doc.$selected = false;
                            avancement_mobilier_doc.$edit = false;
                            vm.selectedItemAvancement_mobilier_doc = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin rapport avancement mobilier****************************************/

 //insertion ou mise a jours ou suppression item dans bdd convention
        /*function miseajourconventiondetail(convention_cife_detail,suppression,avancement)
        {console.log('re');
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        convention_cife_detail.id,      
                    montant_total:    convention_cife_detail.montant_total,
                    avancement:    avancement,
                    intitule:    convention_cife_detail.intitule, 
                    id_convention_entete: convention_cife_detail.convention_entete.id ,
                    delai:    convention_cife_detail.delai,
                    date_signature:    convertionDate(new Date(convention_cife_detail.date_signature)),
                    id_compte_feffi: convention_cife_detail.compte_feffi.id,
                    observation: convention_cife_detail.observation,            
                });
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_detail/index",datas, config).success(function (data)
            {
              vm.selectedItemConvention_detail.avancement  = avancement;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
          }*/

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
        

    }
})();
