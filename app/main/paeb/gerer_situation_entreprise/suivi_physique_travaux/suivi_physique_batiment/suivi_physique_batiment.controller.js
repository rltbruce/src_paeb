(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.suivi_physique_travaux.suivi_physique_batiment')
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
        .controller('Suivi_physique_batimentController', Suivi_physique_batimentController);
    /** @ngInject */
    function Suivi_physique_batimentController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
		    var vm = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

       
        vm.selectedItemBatiment_construction = {} ;
        vm.allbatiment_construction  = [] ;

        var NouvelItemAvenant_prestataire=false;
        var currentItemAvenant_prestataire;
        vm.selectedItemAvenant_prestataire = {} ;
        vm.allavenant_prestataire = [] ;

        vm.allprestataire = [] ;

        vm.ajoutAvancement_batiment = ajoutAvancement_batiment ;
        var NouvelItemAvancement_batiment=false;
        var currentItemAvancement_batiment;
        vm.selectedItemAvancement_batiment = {} ;
        vm.allavancement_batiment = [] ;
        vm.allattachement_batiment = [] ;
        vm.allcurrentattachement_batiment = [] ;

        vm.ajoutAvancement_batiment_doc = ajoutAvancement_batiment_doc ;
        var NouvelItemAvancement_batiment_doc=false;
        var currentItemAvancement_batiment_doc;
        vm.selectedItemAvancement_batiment_doc = {} ;
        vm.allavancement_batiment_doc = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;

        vm.showbuttonNouvContrat_prestataire=true;
        vm.date_now         = new Date();
        vm.showThParcourir = false;

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
        /*apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });*/

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
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
              apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontrat_prestataireBycisco','id_cisco',usercisco.id).then(function(result)
              {
                  vm.allcontrat_prestataire = result.data.response; 
                  console.log(vm.allcontrat_prestataire);
              });
            }
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

/*****************debut batiment construction***************/
      //col table
        vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"Nombre batiment"
        },
        {
          titre:"Cout unitaire"
        }];

        //fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;
          
            if (vm.selectedItemBatiment_construction.id!=0)
            {apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                console.log(vm.alllatrine_construction);
                  
              });

              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  
              });
              apiFactory.getAPIgeneraliserREST("avancement_batiment/index",'menu','getavancementBybatiment','id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allavancement_batiment = result.data.response;
                  
              });
              apiFactory.getAPIgeneraliserREST("attachement_batiment/index",'id_type_batiment',vm.selectedItemBatiment_construction.type_batiment.id).then(function(result)
              {
                  vm.allattachement_batiment = result.data.response;
                  console.log(vm.allattachement_batiment);
                  console.log(vm.selectedItemBatiment_construction.type_batiment.id);
                  
              });
              vm.stepTwo = true;
              vm.stepThree = false;
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


/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_batiment_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Attachement"
        },
        //{titre:"Ponderation"
        //},
        {titre:"Date"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvancement_batiment = function ()
        { 
          if (NouvelItemAvancement_batiment == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              description: '',
              observation: '',
              date: '',
              id_attachement_batiment:'',
              ponderation_batiment:'',
              attachement_batiment:{ponderation_batiment:0}
            };         
            vm.allavancement_batiment.push(items);
            vm.allavancement_batiment.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_batiment = mem;
              }
            });
            
            NouvelItemAvancement_batiment= true ;
            console.log(vm.allavancement_batiment);
            if (vm.allavancement_batiment.length>1)
            {
              var max_ponderation_batiment = Math.max.apply(Math, vm.allavancement_batiment.map(function(o)
            { 
                  return o.attachement_batiment.ponderation_batiment;
            }));
            vm.allcurrentattachement_batiment = vm.allattachement_batiment.filter(function(obj)
            {
                return obj.ponderation_batiment > max_ponderation_batiment;
            });
            console.log(max_ponderation_batiment);
            console.log(vm.allcurrentattachement_batiment);

            }else
            {
              vm.allcurrentattachement_batiment = vm.allattachement_batiment;
            }
            

          }else
          {
            vm.showAlert('Ajout avancement_batiment','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_batiment(avancement_batiment,suppression)
        {
            if (NouvelItemAvancement_batiment==false)
            {
                test_existanceAvancement_batiment(avancement_batiment,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_batiment(avancement_batiment,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerAvancement_batiment= function(item)
        {
          if (NouvelItemAvancement_batiment == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvancement_batiment.intitule ;
            item.description   = currentItemAvancement_batiment.description ;
            item.observation   = currentItemAvancement_batiment.observation ;
            item.date = currentItemAvancement_batiment.date ;
            item.id_attachement_batiment = currentItemAvancement_batiment.id_attachement_batiment;
            item.ponderation_batiment = currentItemAvancement_batiment.ponderation_batiment ;
           
          }else
          {
            vm.allavancement_batiment = vm.allavancement_batiment.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_batiment.id;
            });
          }

          vm.selectedItemAvancement_batiment = {} ;
          NouvelItemAvancement_batiment      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_batiment= function (item)
        {
            vm.selectedItemAvancement_batiment = item;
            vm.nouvelItemAvancement_batiment   = item;
            currentItemAvancement_batiment    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_batiment));
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_batiment_doc/index",'id_avancement_batiment',vm.selectedItemAvancement_batiment.id).then(function(result)
            {
                vm.allavancement_batiment_doc = result.data.response;
                console.log(vm.allavancement_batiment_doc);
            });
            vm.stepThree = true;
              vm.stepFor = false;           

           }
             
        };
        $scope.$watch('vm.selectedItemAvancement_batiment', function()
        {
             if (!vm.allavancement_batiment) return;
             vm.allavancement_batiment.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_batiment.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_batiment = function(item)
        {
            NouvelItemAvancement_batiment = false ;
            vm.selectedItemAvancement_batiment = item;
            currentItemAvancement_batiment = angular.copy(vm.selectedItemAvancement_batiment);
            $scope.vm.allavancement_batiment.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvancement_batiment.intitule ;
            item.description   = vm.selectedItemAvancement_batiment.description ;
            item.observation   = vm.selectedItemAvancement_batiment.observation;
            item.date = new Date(vm.selectedItemAvancement_batiment.date);
            item.id_attachement_batiment = vm.selectedItemAvancement_batiment.attachement_batiment.id;
            item.ponderation_batiment = parseInt(vm.selectedItemAvancement_batiment.attachement_batiment.ponderation_batiment);

            var allattachement_batiment_autre = vm.allattachement_batiment.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_batiment.attachement_batiment.id;
            });

            var allavancement_batiment_autre = vm.allavancement_batiment.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_batiment.id;
            });

            //if (vm.allavancement_batiment.length>1)
           // {
              var max_ponderation_batiment = Math.max.apply(Math, allavancement_batiment_autre.map(function(o)
              { 
                return o.attachement_batiment.ponderation_batiment;
              }));
            vm.allcurrentattachement_batiment = allattachement_batiment_autre.filter(function(obj)
            {
                return obj.ponderation_batiment > max_ponderation_batiment;
            });
            vm.allcurrentattachement_batiment.push(vm.selectedItemAvancement_batiment.attachement_batiment);


           /* }else
            {
              vm.allcurrentattachement_batiment = vm.allattachement_batiment;
            }*/
           
        };

        //fonction bouton suppression item avancement_batiment
        vm.supprimerAvancement_batiment = function()
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
                vm.ajoutAvancement_batiment(vm.selectedItemAvancement_batiment,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Avancement_batimente
        function test_existanceAvancement_batiment (item,suppression)
        {          
            if (suppression!=1)
            {
               var avanc = vm.allavancement_batiment.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_batiment.id;
                });
                if(avanc[0])
                {
                   if((avanc[0].intitule   != currentItemAvancement_batiment.intitule )
                    || (avanc[0].description  != currentItemAvancement_batiment.description)
                    || (avanc[0].observation   != currentItemAvancement_batiment.observation )
                    || (avanc[0].date != currentItemAvancement_batiment.date )
                    || (avanc[0].id_attachement_batiment != currentItemAvancement_batiment.id_attachement_batiment))                   
                      { 
                         insert_in_baseAvancement_batiment(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_batiment(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvancement_batiment(avancement_batiment,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_batiment==false)
            {
                getId = vm.selectedItemAvancement_batiment.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avancement_batiment.intitule,
                    description: avancement_batiment.description,
                    observation: avancement_batiment.observation,
                    date: convertionDate(new Date(avancement_batiment.date)),
                    id_attachement_batiment:avancement_batiment.id_attachement_batiment,
                    id_batiment_construction: vm.selectedItemBatiment_construction.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_batiment/index",datas, config).success(function (data)
            {   
                var attac= vm.allattachement_batiment.filter(function(obj)
                {
                    return obj.id == avancement_batiment.id_attachement_batiment;
                });
console.log(attac[0]);

                var length_bat = vm.allbatiment_construction.length;
                var length_lat = vm.alllatrine_construction.length;
                var length_mob = vm.allmobilier_construction.length;
                var length_total = length_bat+length_lat+length_mob;
                var avancement_total=0;
                

                if (NouvelItemAvancement_batiment == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemAvancement_batiment.attachement_batiment = attac[0];
                        
                        vm.selectedItemAvancement_batiment.$selected  = false;
                        vm.selectedItemAvancement_batiment.$edit      = false;
                        vm.selectedItemAvancement_batiment ={};
                        vm.showbuttonNouvAvancement_batiment= false;
                        /*var ponderation_ancien= parseInt(currentItemAvancement_batiment.attachement_batiment.ponderation_batiment);
                        var ponderation_nouve= parseInt(attac[0].ponderation_batiment);
                        avancement_total= ((parseInt(vm.selectedItemConvention_detail.avancement)*length_total)-ponderation_ancien+ponderation_nouve)/length_total;
                        miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
                     
                    }
                    else 
                    {    
                      vm.allavancement_batiment = vm.allavancement_batiment.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvancement_batiment.id;
                      });
                      vm.showbuttonNouvAvancement_batiment= true;

                      /* max_ponderation = Math.max.apply(Math, vm.allavancement_batiment.map(function(o)
                      { 
                        return o.attachement_batiment.ponderation_batiment;
                      }));

                      avancement_total= ((parseInt(vm.selectedItemConvention_detail.avancement)*length_total)-vm.selectedItemAvancement_batiment.ponderation_batiment+max_ponderation)/length_total;
                     
                      
                      miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/


                    }
                    
                }
                else
                {
                  avancement_batiment.attachement_batiment = attac[0];

                  avancement_batiment.id  =   String(data.response);              
                  NouvelItemAvancement_batiment=false;
                  vm.showbuttonNouvAvancement_batiment= false;
                 /* var max_ponderation=0;

                  if(vm.allavancement_batiment.length>1)
                  {
                    var allavancement_batiment_encien = vm.allavancement_batiment.filter(function(obj)
                      {
                          return obj.id !== String(data.response);
                      });
                   max_ponderation = Math.max.apply(Math, allavancement_batiment_encien.map(function(o)
                  { 
                    return o.attachement_batiment.ponderation_batiment;
                  }));
                   console.log(max_ponderation);

                  }
                 //var ponderation_ancien= parseInt(currentItemAvancement_batiment.attachement_batiment.ponderation);
                 avancement_total=((parseFloat(vm.selectedItemConvention_detail.avancement)*length_total)- max_ponderation+parseInt(attac[0].ponderation_batiment))/length_total;
                  //avancement_total= (((parseFloat(vm.selectedItemConvention_detail.avancement)*length_total)+parseInt(attac[0].ponderation_batiment))/length_total).toFixe(3);

                  miseajourconventiondetail(vm.selectedItemConvention_detail,0,avancement_total);*/
            }
              avancement_batiment.$selected = false;
              avancement_batiment.$edit = false;
              vm.selectedItemAvancement_batiment = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changeAttachement_batiment= function(item)
        {console.log(vm.allattachement_batiment);
         /* var atta= vm.allattachement_batiment.filtre(function(obj)
          {
            return obj.id==item.id_attachement_batiment;
          });*/
          var atta = vm.allattachement_batiment.filter(function(obj)
          {
              return obj.id == item.id_attachement_batiment;
          });
          item.ponderation_batiment=parseInt(atta[0].ponderation_batiment);
        }
/**********************************fin avancement batiment****************************************/

/**********************************Debut rapport avancement batiment****************************************/

//col table
        vm.avancement_batiment_doc_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFileAvancement_batiment_doc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemAvancement_batiment_doc.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterAvancement_batiment_doc = function ()
        { 
          if (NouvelItemAvancement_batiment_doc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.allavancement_batiment_doc.push(items);
            vm.allavancement_batiment_doc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_batiment_doc = mem;
              }
            });

            NouvelItemAvancement_batiment_doc = true ;
            vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport avancement','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_batiment_doc(avancement_batiment_doc,suppression)
        {
            if (NouvelItemAvancement_batiment_doc==false)
            {
                test_existanceAvancement_batiment_doc (avancement_batiment_doc,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_batiment_doc(avancement_batiment_doc,suppression);
            }
        }

        //fonction de bouton d'annulation avancement_batiment_doc
        vm.annulerAvancement_batiment_doc = function(item)
        {
          if (NouvelItemAvancement_batiment_doc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvancement_batiment_doc.description ;
            item.fichier   = currentItemAvancement_batiment_doc.fichier ;
          }else
          {
            vm.allavancement_batiment_doc = vm.allavancement_batiment_doc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_batiment_doc.id;
            });
          }

          vm.selectedItemAvancement_batiment_doc = {} ;
          NouvelItemAvancement_batiment_doc      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_batiment_doc= function (item)
        {
            vm.selectedItemAvancement_batiment_doc = item;
            vm.nouvelItemAvancement_batiment_doc   = item;
            currentItemAvancement_batiment_doc    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_batiment_doc)); 
        };
        $scope.$watch('vm.selectedItemAvancement_batiment_doc', function()
        {
             if (!vm.allavancement_batiment_doc) return;
             vm.allavancement_batiment_doc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_batiment_doc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_batiment_doc = function(item)
        {
            NouvelItemAvancement_batiment_doc = false ;
            vm.selectedItemAvancement_batiment_doc = item;
            currentItemAvancement_batiment_doc = angular.copy(vm.selectedItemAvancement_batiment_doc);
            $scope.vm.allavancement_batiment_doc.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemAvancement_batiment_doc.description ;
            item.fichier   = vm.selectedItemAvancement_batiment_doc.fichier ;
            vm.showThParcourir = true;
        };

        //fonction bouton suppression item avancement_batiment_doc
        vm.supprimerAvancement_batiment_doc = function()
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
                vm.avancement_batiment_doc(vm.selectedItemAvancement_batiment_doc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvancement_batiment_doc (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allavancement_batiment_doc.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_batiment_doc.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemAvancement_batiment_doc.description )
                    ||(just[0].fichier   != currentItemAvancement_batiment_doc.fichier ))                   
                      { 
                         insert_in_baseAvancement_batiment_doc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_batiment_doc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd avancement_batiment_doc
        function insert_in_baseAvancement_batiment_doc(avancement_batiment_doc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_batiment_doc==false)
            {
                getId = vm.selectedItemAvancement_batiment_doc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avancement_batiment_doc.description,
                    fichier: avancement_batiment_doc.fichier,
                    id_avancement_batiment: vm.selectedItemAvancement_batiment.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_batiment_doc/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'avancement_batiment_doc/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                var length_bat = vm.allbatiment_construction.length;
                var length_lat = vm.alllatrine_construction.length;
                var length_mob = vm.allmobilier_construction.length;
                var length_total = length_bat+length_lat+length_mob;
                var avancement_total=0;

                if (NouvelItemAvancement_batiment_doc==false)
                {
                    getIdFile = vm.selectedItemAvancement_batiment_doc.id; 
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
                          avancement_batiment_doc.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: avancement_batiment_doc.description,
                              fichier: avancement_batiment_doc.fichier,
                              id_avancement_batiment: vm.selectedItemAvancement_batiment.id               
                          });
                            apiFactory.add("avancement_batiment_doc/index",datas, config).success(function (data)
                            {
                              if (NouvelItemAvancement_batiment_doc == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemAvancement_batiment_doc.description = avancement_batiment_doc.description;
                                      vm.selectedItemAvancement_batiment_doc.fichier = avancement_batiment_doc.fichier;
                                      vm.selectedItemAvancement_batiment_doc.$selected  = false;
                                      vm.selectedItemAvancement_batiment_doc.$edit      = false;
                                      vm.selectedItemAvancement_batiment_doc ={};
                                  }
                                  else 
                                  {    
                                    vm.allavancement_batiment_doc = vm.allavancement_batiment_doc.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvancement_batiment_doc.id;
                                    });
                                  }
                              }
                              else
                              {
                                avancement_batiment_doc.description = avancement_batiment_doc.description;
                                avancement_batiment_doc.fichier = avancement_batiment_doc.fichier; 

                                avancement_batiment_doc.id  =   String(data.response);              
                                NouvelItemAvancement_batiment_doc=false;
                          }
                            avancement_batiment_doc.$selected = false;
                            avancement_batiment_doc.$edit = false;
                            vm.selectedItemAvancement_batiment_doc = {};
                            vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        avancement_batiment_doc.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: avancement_batiment_doc.description,
                              fichier: avancement_batiment_doc.fichier,
                              id_avancement_batiment: vm.selectedItemAvancement_batiment.id               
                          });
                        apiFactory.add("avancement_batiment_doc/index",datas, config).success(function (data)
                            {
                              if (NouvelItemAvancement_batiment_doc == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemAvancement_batiment_doc.description = avancement_batiment_doc.description;
                                      vm.selectedItemAvancement_batiment_doc.fichier = avancement_batiment_doc.fichier;
                                      vm.selectedItemAvancement_batiment_doc.$selected  = false;
                                      vm.selectedItemAvancement_batiment_doc.$edit      = false;
                                      vm.selectedItemAvancement_batiment_doc ={};
                                  }
                                  else 
                                  {    
                                    vm.allavancement_batiment_doc = vm.allavancement_batiment_doc.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvancement_batiment_doc.id;
                                    });
                                  }
                              }
                              else
                              {
                                avancement_batiment_doc.description = avancement_batiment_doc.description;
                                avancement_batiment_doc.fichier = avancement_batiment_doc.fichier; 

                                avancement_batiment_doc.id  =   String(data.response);              
                                NouvelItemAvancement_batiment_doc=false;
                          }
                            avancement_batiment_doc.$selected = false;
                            avancement_batiment_doc.$edit = false;
                            vm.selectedItemAvancement_batiment_doc = {};
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
/**********************************fin rapport avancement batiment****************************************/


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
