(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_odc.module_odc_insertion')
        .controller('Module_odc_insertionController', Module_odc_insertionController);
    /** @ngInject */
    function Module_odc_insertionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
		   var vm = this;
        vm.selectedItemPartenaire_relai = {} ;
        vm.allpartenaire_relai = [] ;

        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutModule_odc = ajoutModule_odc ;
        var NouvelItemModule_odc=false;
        var currentItemModule_odc;
        vm.selectedItemModule_odc = {} ;
        vm.allmodule_odc = [] ;

        vm.allclassification_site =[];

        vm.ajoutParticipant_odc = ajoutParticipant_odc ;
        var NouvelItemParticipant_odc=false;
        var currentItemParticipant_odc;
        vm.selectedItemParticipant_odc = {} ;
        vm.allparticipant_odc = [] ;

        vm.allsituation_participant_odc = [] ;

        vm.ajoutRapport_odc = ajoutRapport_odc;
        var NouvelItemRapport_odc=false;
        var currentItemRapport_odc;
        vm.selectedItemRapport_odc = {} ;
        vm.allrapport_odc = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;

        vm.showbuttonNouvPassation=true;
        vm.showbuttonNouvRapport =true;
        vm.date_now         = new Date();

        vm.showbuttonValidation = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'DPFI'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }          
        });
/**********************************debut passation_marches_moe****************************************/

  apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratBySansodc').then(function(result)
  {
      vm.allcontrat_partenaire_relai = result.data.response; 
      console.log(vm.allcontrat_partenaire_relai);
  });

  apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodule_odcByinvalide').then(function(result)
  {
      vm.allmodule_odc = result.data.response;
      
      console.log(vm.allmodule_odc);

      if (result.data.response.length!=0)
      {
          vm.showbuttonNouvPassation=false;
      }
  });

//col table
        vm.module_odc_column = [
        {titre:"Contrat"
        },
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
        },
        {titre:"Action"
        }];


        apiFactory.getAll("situation_participant_odc/index").then(function(result)
        {
            vm.allsituation_participant_odc = result.data.response; 
                  console.log( vm.allsituation_participant_odc);
        });        
        //Masque de saisi ajout
        vm.ajouterModule_odc = function ()
        { 
          if (NouvelItemModule_odc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              id_contrat_partenaire_relai: '',
              observation:''
            };         
            vm.allmodule_odc.push(items);
            vm.allmodule_odc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_odc = mem;
              }
            });

            NouvelItemModule_odc = true ;
          }else
          {
            vm.showAlert('Ajout module_odc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_odc(module_odc,suppression)
        {
            if (NouvelItemModule_odc==false)
            {
                test_existanceModule_odc (module_odc,suppression); 
            } 
            else
            {
                insert_in_baseModule_odc(module_odc,suppression);
            }
        }

        //fonction de bouton d'annulation module_odc
        vm.annulerModule_odc = function(item)
        {
          if (NouvelItemModule_odc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_odc.observation ;
            item.date_debut_reel_form   = currentItemModule_odc.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_odc.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_odc.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_odc.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_odc.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_odc.date_fin_previ_form ;
            item.id_contrat_partenaire_relai  = currentItemModule_odc.id_contrat_partenaire_relai;
            item.id_classification_site = currentItemModule_odc.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_odc.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_odc.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_odc.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_odc.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_odc = vm.allmodule_odc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_odc.id;
            });
          }

          vm.selectedItemModule_odc = {} ;
          NouvelItemModule_odc      = false;
          vm.showbuttonValidation = false;
          
        };

        //fonction selection item region
        vm.selectionModule_odc= function (item)
        {
            vm.selectedItemModule_odc = item;
            vm.nouvelItemModule_odc   = item;
            currentItemModule_odc    = JSON.parse(JSON.stringify(vm.selectedItemModule_odc));
            vm.showbuttonNouvRapport =true;

            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_odc/index",'id_module_odc',vm.selectedItemModule_odc.id).then(function(result)
              {
                  vm.allparticipant_odc = result.data.response; 
                  console.log( vm.allparticipant_odc);
              });

              apiFactory.getAPIgeneraliserREST("rapport_odc/index",'id_module_odc',vm.selectedItemModule_odc.id).then(function(result)
              {
                  vm.allrapport_odc = result.data.response; 
                  if (vm.allrapport_odc.length>0)
                  {
                    vm.showbuttonNouvRapport =false;
                  }
              });

              vm.stepOne = true;
              vm.stepTwo = false;

              vm.showbuttonValidation = true;
              if (item.$edit==true)
                  {
                    vm.showbuttonValidation = false;
                  }
            }
        };
        $scope.$watch('vm.selectedItemModule_odc', function()
        {
             if (!vm.allmodule_odc) return;
             vm.allmodule_odc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_odc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierModule_odc = function(item)
        {
            NouvelItemModule_odc = false ;
            vm.selectedItemModule_odc = item;
            currentItemModule_odc = angular.copy(vm.selectedItemModule_odc);
            $scope.vm.allmodule_odc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_odc.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_odc.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_odc.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_odc.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_odc.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_odc.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_odc.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_odc.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_odc.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_odc.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_odc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_odc.lieu_formation;
            vm.showbuttonValidation = false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_odc = function()
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
                vm.ajoutModule_odc(vm.selectedItemModule_odc,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_odc (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_odc.filter(function(obj)
                {
                   return obj.id == currentItemModule_odc.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_odc.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_odc.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_odc.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_odc.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_odc.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_odc.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_odc.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_odc.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_odc.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_odc.date_fin_previ_form)
                    || (pass[0].id_contrat_partenaire_relai  != currentItemModule_odc.id_contrat_partenaire_relai ) )                   
                      { 
                         insert_in_baseModule_odc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_odc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_odc(module_odc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_odc==false)
            {
                getId = vm.selectedItemModule_odc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_odc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_odc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_odc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_odc.date_reel_resti)),
                    nbr_previ_parti: module_odc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_odc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_odc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_odc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_odc.id_contrat_partenaire_relai,
                    lieu_formation: module_odc.lieu_formation,
                    observation:module_odc.observation,
                    validation:0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_odc/index",datas, config).success(function (data)
            {   
                var contrat_part= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == module_odc.id_contrat_partenaire_relai;
                });
                var classif= vm.allclassification_site.filter(function(obj)
                {
                    return obj.id == module_odc.id_classification_site;
                });


                if (NouvelItemModule_odc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_odc.contrat_partenaire_relai = contrat_part[0];
                        vm.selectedItemModule_odc.classification_site= classif[0];
                        vm.selectedItemModule_odc.$selected  = false;
                        vm.selectedItemModule_odc.$edit      = false;
                        vm.selectedItemModule_odc ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_odc = vm.allmodule_odc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_odc.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                  module_odc.contrat_partenaire_relai = contrat_part[0];
                  module_odc.classification_site = classif[0];

                  module_odc.id  =   String(data.response);              
                  NouvelItemModule_odc=false;
                  vm.showbuttonNouvPassation= false;
            }
              module_odc.$selected = false;
              module_odc.$edit = false;
              vm.selectedItemModule_odc = {};
              vm.showbuttonValidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_odc = function()
        {
          valide_insert_in_baseModule_odc(vm.selectedItemModule_odc,0);
        }

        function valide_insert_in_baseModule_odc(module_odc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_odc==false)
            {
                getId = vm.selectedItemModule_odc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_odc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_odc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_odc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_odc.date_reel_resti)),
                    nbr_previ_parti: module_odc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_odc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_odc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_odc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_odc.contrat_partenaire_relai.id,
                    lieu_formation: module_odc.lieu_formation,
                    observation:module_odc.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_odc/index",datas, config).success(function (data)
            {   
                vm.allmodule_odc = vm.allmodule_odc.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemModule_odc.id;
                });
                vm.showbuttonValidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches_moe****************************************/

/**********************************debut participant_odc****************************************/
//col table
        vm.participant_odc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_odc = function ()
        { 
          if (NouvelItemParticipant_odc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_odc:''
            };         
            vm.allparticipant_odc.push(items);
            vm.allparticipant_odc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_odc = mem;
              }
            });

            NouvelItemParticipant_odc = true ;
          }else
          {
            vm.showAlert('Ajout participant_odc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_odc(participant_odc,suppression)
        {
            if (NouvelItemParticipant_odc==false)
            {
                test_existanceParticipant_odc (participant_odc,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_odc(participant_odc,suppression);
            }
        }

        //fonction de bouton d'annulation participant_odc
        vm.annulerParticipant_odc = function(item)
        {
          if (NouvelItemParticipant_odc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_odc.nom ;
            item.prenom   = currentItemParticipant_odc.prenom ;
            item.sexe      = currentItemParticipant_odc.sexe;
            item.id_situation_participant_odc   = currentItemParticipant_odc.id_situation_participant_odc ; 
          }else
          {
            vm.allparticipant_odc = vm.allparticipant_odc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_odc.id;
            });
          }

          vm.selectedItemParticipant_odc = {} ;
          NouvelItemParticipant_odc      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_odc= function (item)
        {
            vm.selectedItemParticipant_odc = item;
            vm.nouvelItemParticipant_odc   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_odc    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_odc));
            } 
        };
        $scope.$watch('vm.selectedItemParticipant_odc', function()
        {
             if (!vm.allparticipant_odc) return;
             vm.allparticipant_odc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_odc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_odc = function(item)
        {
            NouvelItemParticipant_odc = false ;
            vm.selectedItemParticipant_odc = item;
            currentItemParticipant_odc = angular.copy(vm.selectedItemParticipant_odc);
            $scope.vm.allparticipant_odc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_odc.nom ;
            item.prenom = vm.selectedItemParticipant_odc.prenom;
            item.sexe  = vm.selectedItemParticipant_odc.sexe;
            item.id_situation_participant_odc = vm.selectedItemParticipant_odc.situation_participant_odc.id; 
        };

        //fonction bouton suppression item participant_odc
        vm.supprimerParticipant_odc = function()
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
                vm.ajoutParticipant_odc(vm.selectedItemParticipant_odc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_odc (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_odc.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_odc.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_odc.nom) 
                    || (mem[0].prenom!=currentItemParticipant_odc.prenom)
                    || (mem[0].sexe!=currentItemParticipant_odc.sexe)
                    || (mem[0].age!=currentItemParticipant_odc.age)
                    || (mem[0].id_situation_participant_odc!=currentItemParticipant_odc.id_situation_participant_odc))                    
                      { 
                         insert_in_baseParticipant_odc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_odc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_odc(participant_odc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_odc==false)
            {
                getId = vm.selectedItemParticipant_odc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_odc.nom,
                    prenom: participant_odc.prenom,
                    sexe: participant_odc.sexe,
                    id_situation_participant_odc: participant_odc.id_situation_participant_odc,
                    id_module_odc: vm.selectedItemModule_odc.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_odc/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_odc.filter(function(obj)
                {
                    return obj.id == participant_odc.id_situation_participant_odc;
                });

                if (NouvelItemParticipant_odc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_odc.situation_participant_odc= situ[0];
                        

                        if(currentItemParticipant_odc.sexe == 1 && currentItemParticipant_odc.sexe !=vm.selectedItemParticipant_odc.sexe)
                        {
                          vm.selectedItemModule_odc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_odc.sexe == 2 && currentItemParticipant_odc.sexe !=vm.selectedItemParticipant_odc.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_odc.$selected  = false;
                        vm.selectedItemParticipant_odc.$edit      = false;
                        vm.selectedItemParticipant_odc ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_odc = vm.allparticipant_odc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_odc.id;
                      });
                      
                      vm.selectedItemModule_odc.nbr_parti = parseInt(vm.selectedItemModule_odc.nbr_parti)-1;
                      
                      if(parseInt(participant_odc.sexe) == 2)
                      {
                        vm.selectedItemModule_odc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_odc.situation_participant_odc = situ[0];
                  participant_odc.id  =   String(data.response);              
                  NouvelItemParticipant_odc=false;

                  vm.selectedItemModule_odc.nbr_parti = parseInt(vm.selectedItemModule_odc.nbr_parti)+1;
                  if(parseInt(participant_odc.sexe) == 2)
                  {
                    vm.selectedItemModule_odc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti)+1;
                  }
            }
              participant_odc.$selected = false;
              participant_odc.$edit = false;
              vm.selectedItemParticipant_odc = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        /**********************************debut compte****************************************/


        /**********************************fin justificatif attachement****************************************/

//col table
        vm.rapport_odc_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemRapport_odc.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemRapport_odc.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterRapport_odc = function ()
        { 
          if (NouvelItemRapport_odc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              fichier: ''
            };
        
            vm.allrapport_odc.push(items);
            vm.allrapport_odc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRapport_odc = mem;
              }
            });

            NouvelItemRapport_odc = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport_odc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutRapport_odc(rapport_odc,suppression)
        {
            if (NouvelItemRapport_odc==false)
            {
                test_existanceRapport_odc (rapport_odc,suppression); 
            } 
            else
            {
                insert_in_baseRapport_odc(rapport_odc,suppression);
            }
        }

        //fonction de bouton d'annulation rapport_odc
        vm.annulerRapport_odc = function(item)
        {
          if (NouvelItemRapport_odc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemRapport_odc.intitule ;
            item.fichier   = currentItemRapport_odc.fichier ;
          }else
          {
            vm.allrapport_odc = vm.allrapport_odc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRapport_odc.id;
            });
          }

          vm.selectedItemRapport_odc = {} ;
          NouvelItemRapport_odc      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRapport_odc= function (item)
        {
            vm.selectedItemRapport_odc = item;
            vm.nouvelItemRapport_odc   = item;
            currentItemRapport_odc    = JSON.parse(JSON.stringify(vm.selectedItemRapport_odc)); 
        };
        $scope.$watch('vm.selectedItemRapport_odc', function()
        {
             if (!vm.allrapport_odc) return;
             vm.allrapport_odc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_odc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRapport_odc = function(item)
        {
            NouvelItemRapport_odc = false ;
            vm.selectedItemRapport_odc = item;
            currentItemRapport_odc = angular.copy(vm.selectedItemRapport_odc);
            $scope.vm.allrapport_odc.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemRapport_odc.intitule ;
            item.fichier   = vm.selectedItemRapport_odc.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item rapport_odc
        vm.supprimerRapport_odc = function()
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
                vm.ajoutRapport_odc(vm.selectedItemRapport_odc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRapport_odc (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allrapport_odc.filter(function(obj)
                {
                   return obj.id == currentItemRapport_odc.id;
                });
                if(just[0])
                {
                   if((just[0].intitule   != currentItemRapport_odc.intitule )
                    ||(just[0].fichier   != currentItemRapport_odc.fichier ))                   
                      { 
                         insert_in_baseRapport_odc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRapport_odc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rapport_odc
        function insert_in_baseRapport_odc(rapport_odc,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRapport_odc==false)
            {
                getId = vm.selectedItemRapport_odc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: rapport_odc.intitule,
                    fichier: rapport_odc.fichier,
                    id_module_odc: vm.selectedItemModule_odc.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_odc/index",datas, config).success(function (data)
            {   

              if (NouvelItemRapport_odc == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'rapport_odc/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemRapport_odc.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemModule_odc.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    rapport_odc.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      intitule: rapport_odc.intitule,
                                                      fichier: rapport_odc.fichier,
                                                      id_module_odc: vm.selectedItemModule_odc.id
                                        });
                                      apiFactory.add("rapport_odc/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          rapport_odc.$selected = false;
                                          rapport_odc.$edit = false;
                                          vm.selectedItemRapport_odc = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  rapport_odc.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        intitule: rapport_odc.intitule,
                                        fichier: rapport_odc.fichier,
                                        id_module_odc: vm.selectedItemModule_odc.id               
                                    });
                                  apiFactory.add("rapport_odc/index",datas, config).success(function (data)
                                  {
                                        
                                      rapport_odc.$selected = false;
                                      rapport_odc.$edit = false;
                                      vm.selectedItemRapport_odc = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemRapport_odc.$selected  = false;
                        vm.selectedItemRapport_odc.$edit      = false;
                        vm.selectedItemRapport_odc ={};
                    }
                    else 
                    {    
                      vm.allrapport_odc = vm.allrapport_odc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_odc.id;
                      });
                      var chemin= vm.selectedItemRapport_odc.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonNouvRapport =true;
                    }
              }
              else
              {
                  rapport_odc.id  =   String(data.response);              
                  NouvelItemRapport_odc = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'rapport_odc/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemModule_odc.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              rapport_odc.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                intitule: rapport_odc.intitule,
                                                fichier: rapport_odc.fichier,
                                                id_module_odc: vm.selectedItemModule_odc.id
                                  });
                                apiFactory.add("rapport_odc/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    rapport_odc.$selected = false;
                                    rapport_odc.$edit = false;
                                    vm.selectedItemRapport_odc = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            rapport_odc.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  intitule: rapport_odc.intitule,
                                  fichier: rapport_odc.fichier,
                                  id_module_odc: vm.selectedItemModule_odc.id               
                              });
                            apiFactory.add("rapport_odc/index",datas, config).success(function (data)
                            {
                                  
                                rapport_odc.$selected = false;
                                rapport_odc.$edit = false;
                                vm.selectedItemRapport_odc = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
                    vm.showbuttonNouvRapport =false;
              }
              rapport_odc.$selected = false;
              rapport_odc.$edit = false;
              vm.selectedItemRapport_odc = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif batiment****************************************/

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
        

    }
})();
