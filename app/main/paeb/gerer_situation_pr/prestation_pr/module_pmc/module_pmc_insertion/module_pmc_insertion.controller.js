(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_pmc.module_pmc_insertion')
        .controller('Module_pmc_insertionController', Module_pmc_insertionController);
    /** @ngInject */
    function Module_pmc_insertionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
		   var vm = this;
        vm.selectedItemPartenaire_relai = {} ;
        vm.allpartenaire_relai = [] ;

        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutModule_pmc = ajoutModule_pmc ;
        var NouvelItemModule_pmc=false;
        var currentItemModule_pmc;
        vm.selectedItemModule_pmc = {} ;
        vm.allmodule_pmc = [] ;

        vm.allclassification_site =[];

        vm.ajoutParticipant_pmc = ajoutParticipant_pmc ;
        var NouvelItemParticipant_pmc=false;
        var currentItemParticipant_pmc;
        vm.selectedItemParticipant_pmc = {} ;
        vm.allparticipant_pmc = [] ;

        vm.allsituation_participant_pmc = [] ;

        vm.ajoutRapport_pmc = ajoutRapport_pmc;
        var NouvelItemRapport_pmc=false;
        var currentItemRapport_pmc;
        vm.selectedItemRapport_pmc = {} ;
        vm.allrapport_pmc = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;

        //vm.showbuttonNouvPassation=true;
        vm.showbuttonNouvRapport =true;
        vm.date_now         = new Date();
        vm.showbuttonValidation = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


/**********************************debut passation_marches_moe****************************************/

  apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratBySanspmc').then(function(result)
  {
      vm.allcontrat_partenaire_relai = result.data.response; 
      console.log(vm.allcontrat_partenaire_relai);
  });

  apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodule_pmcByinvalide').then(function(result)
  {
      vm.allmodule_pmc = result.data.response;
      
      console.log(vm.allmodule_pmc);

     /* if (result.data.response.length!=0)
      {
          //vm.showbuttonNouvPassation=false;
      }*/
  });
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
//col table
        vm.module_pmc_column = [
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
        {titre:"Nombre prévisionnel participant_pmc"
        },
        {titre:"Nombre de participant_pmc"
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


        apiFactory.getAll("situation_participant_pmc/index").then(function(result)
        {
            vm.allsituation_participant_pmc = result.data.response; 
                  console.log( vm.allsituation_participant_pmc);
        });        
        //Masque de saisi ajout
        vm.ajouterModule_pmc = function ()
        { 
          if (NouvelItemModule_pmc == false)
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
            vm.allmodule_pmc.push(items);
            vm.allmodule_pmc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_pmc = mem;
              }
            });

            NouvelItemModule_pmc = true ;
          }else
          {
            vm.showAlert('Ajout module_pmc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_pmc(module_pmc,suppression)
        {
            if (NouvelItemModule_pmc==false)
            {
                test_existanceModule_pmc (module_pmc,suppression); 
            } 
            else
            {
                insert_in_baseModule_pmc(module_pmc,suppression);
            }
        }

        //fonction de bouton d'annulation module_pmc
        vm.annulerModule_pmc = function(item)
        {
          if (NouvelItemModule_pmc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_pmc.observation ;
            item.date_debut_reel_form   = currentItemModule_pmc.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_pmc.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_pmc.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_pmc.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_pmc.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_pmc.date_fin_previ_form ;
            item.id_contrat_partenaire_relai  = currentItemModule_pmc.id_contrat_partenaire_relai;
            item.id_classification_site = currentItemModule_pmc.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_pmc.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_pmc.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_pmc.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_pmc.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_pmc = vm.allmodule_pmc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_pmc.id;
            });
          }

          vm.selectedItemModule_pmc = {} ;
          NouvelItemModule_pmc      = false;
          vm.showbuttonValidation = false;
          
        };

        //fonction selection item region
        vm.selectionModule_pmc= function (item)
        {
            vm.selectedItemModule_pmc = item;
            vm.nouvelItemModule_pmc   = item;
            currentItemModule_pmc    = JSON.parse(JSON.stringify(vm.selectedItemModule_pmc));
            vm.showbuttonNouvRapport =true;

            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_pmc/index",'id_module_pmc',vm.selectedItemModule_pmc.id).then(function(result)
              {
                  vm.allparticipant_pmc = result.data.response; 
                  console.log( vm.allparticipant_pmc);
              });

              apiFactory.getAPIgeneraliserREST("rapport_pmc/index",'id_module_pmc',vm.selectedItemModule_pmc.id).then(function(result)
              {
                  vm.allrapport_pmc = result.data.response; 
                  if (vm.allrapport_pmc.length>0)
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
        $scope.$watch('vm.selectedItemModule_pmc', function()
        {
             if (!vm.allmodule_pmc) return;
             vm.allmodule_pmc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_pmc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierModule_pmc = function(item)
        {
            NouvelItemModule_pmc = false ;
            vm.selectedItemModule_pmc = item;
            currentItemModule_pmc = angular.copy(vm.selectedItemModule_pmc);
            $scope.vm.allmodule_pmc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_pmc.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_pmc.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_pmc.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_pmc.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_pmc.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_pmc.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_pmc.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_pmc.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_pmc.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_pmc.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_pmc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_pmc.lieu_formation;
            vm.showbuttonValidation = false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_pmc = function()
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
                vm.ajoutModule_pmc(vm.selectedItemModule_pmc,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_pmc (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_pmc.filter(function(obj)
                {
                   return obj.id == currentItemModule_pmc.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_pmc.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_pmc.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_pmc.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_pmc.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_pmc.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_pmc.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_pmc.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_pmc.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_pmc.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_pmc.date_fin_previ_form)
                    || (pass[0].id_contrat_partenaire_relai  != currentItemModule_pmc.id_contrat_partenaire_relai ) )                   
                      { 
                         insert_in_baseModule_pmc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_pmc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_pmc(module_pmc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_pmc==false)
            {
                getId = vm.selectedItemModule_pmc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_pmc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_pmc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_pmc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_pmc.date_reel_resti)),
                    nbr_previ_parti: module_pmc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_pmc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_pmc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_pmc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_pmc.id_contrat_partenaire_relai,
                    lieu_formation: module_pmc.lieu_formation,
                    observation:module_pmc.observation,
                    validation:0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_pmc/index",datas, config).success(function (data)
            {   
                var contrat_part= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == module_pmc.id_contrat_partenaire_relai;
                });
                var classif= vm.allclassification_site.filter(function(obj)
                {
                    return obj.id == module_pmc.id_classification_site;
                });


                if (NouvelItemModule_pmc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_pmc.contrat_partenaire_relai = contrat_part[0];
                        vm.selectedItemModule_pmc.classification_site= classif[0];
                        vm.selectedItemModule_pmc.$selected  = false;
                        vm.selectedItemModule_pmc.$edit      = false;
                        vm.selectedItemModule_pmc ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_pmc = vm.allmodule_pmc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_pmc.id;
                      });
                      //vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                  module_pmc.contrat_partenaire_relai = contrat_part[0];
                  module_pmc.classification_site = classif[0];

                  module_pmc.id  =   String(data.response);              
                  NouvelItemModule_pmc=false;
                  //vm.showbuttonNouvPassation= false;
            }
              vm.showbuttonValidation = false;
              module_pmc.$selected = false;
              module_pmc.$edit = false;
              vm.selectedItemModule_pmc = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_pmc = function()
        {
          valide_insert_in_baseModule_pmc(vm.selectedItemModule_pmc,0);
        }

        function valide_insert_in_baseModule_pmc(module_pmc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_pmc==false)
            {
                getId = vm.selectedItemModule_pmc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_pmc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_pmc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_pmc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_pmc.date_reel_resti)),
                    nbr_previ_parti: module_pmc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_pmc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_pmc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_pmc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_pmc.contrat_partenaire_relai.id,
                    lieu_formation: module_pmc.lieu_formation,
                    observation:module_pmc.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_pmc/index",datas, config).success(function (data)
            {   
                vm.allmodule_pmc = vm.allmodule_pmc.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemModule_pmc.id;
                });
                vm.showbuttonValidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches_moe****************************************/

/**********************************debut participant_pmc****************************************/
//col table
        vm.participant_pmc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_pmc = function ()
        { 
          if (NouvelItemParticipant_pmc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_pmc:''
            };         
            vm.allparticipant_pmc.push(items);
            vm.allparticipant_pmc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_pmc = mem;
              }
            });

            NouvelItemParticipant_pmc = true ;
          }else
          {
            vm.showAlert('Ajout participant_pmc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_pmc(participant_pmc,suppression)
        {
            if (NouvelItemParticipant_pmc==false)
            {
                test_existanceParticipant_pmc (participant_pmc,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_pmc(participant_pmc,suppression);
            }
        }

        //fonction de bouton d'annulation participant_pmc
        vm.annulerParticipant_pmc = function(item)
        {
          if (NouvelItemParticipant_pmc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_pmc.nom ;
            item.prenom   = currentItemParticipant_pmc.prenom ;
            item.sexe      = currentItemParticipant_pmc.sexe;
            item.id_situation_participant_pmc   = currentItemParticipant_pmc.id_situation_participant_pmc ; 
          }else
          {
            vm.allparticipant_pmc = vm.allparticipant_pmc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_pmc.id;
            });
          }

          vm.selectedItemParticipant_pmc = {} ;
          NouvelItemParticipant_pmc      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_pmc= function (item)
        {
            vm.selectedItemParticipant_pmc = item;
            vm.nouvelItemParticipant_pmc   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_pmc    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_pmc));
            } 
        };
        $scope.$watch('vm.selectedItemParticipant_pmc', function()
        {
             if (!vm.allparticipant_pmc) return;
             vm.allparticipant_pmc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_pmc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_pmc = function(item)
        {
            NouvelItemParticipant_pmc = false ;
            vm.selectedItemParticipant_pmc = item;
            currentItemParticipant_pmc = angular.copy(vm.selectedItemParticipant_pmc);
            $scope.vm.allparticipant_pmc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_pmc.nom ;
            item.prenom = vm.selectedItemParticipant_pmc.prenom;
            item.sexe  = vm.selectedItemParticipant_pmc.sexe;
            item.id_situation_participant_pmc = vm.selectedItemParticipant_pmc.situation_participant_pmc.id; 
        };

        //fonction bouton suppression item participant_pmc
        vm.supprimerParticipant_pmc = function()
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
                vm.ajoutParticipant_pmc(vm.selectedItemParticipant_pmc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_pmc (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_pmc.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_pmc.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_pmc.nom) 
                    || (mem[0].prenom!=currentItemParticipant_pmc.prenom)
                    || (mem[0].sexe!=currentItemParticipant_pmc.sexe)
                    || (mem[0].age!=currentItemParticipant_pmc.age)
                    || (mem[0].id_situation_participant_pmc!=currentItemParticipant_pmc.id_situation_participant_pmc))                    
                      { 
                         insert_in_baseParticipant_pmc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_pmc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_pmc(participant_pmc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_pmc==false)
            {
                getId = vm.selectedItemParticipant_pmc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_pmc.nom,
                    prenom: participant_pmc.prenom,
                    sexe: participant_pmc.sexe,
                    id_situation_participant_pmc: participant_pmc.id_situation_participant_pmc,
                    id_module_pmc: vm.selectedItemModule_pmc.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_pmc/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_pmc.filter(function(obj)
                {
                    return obj.id == participant_pmc.id_situation_participant_pmc;
                });

                if (NouvelItemParticipant_pmc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_pmc.situation_participant_pmc= situ[0];
                        

                        if(currentItemParticipant_pmc.sexe == 1 && currentItemParticipant_pmc.sexe !=vm.selectedItemParticipant_pmc.sexe)
                        {
                          vm.selectedItemModule_pmc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_pmc.sexe == 2 && currentItemParticipant_pmc.sexe !=vm.selectedItemParticipant_pmc.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_pmc.$selected  = false;
                        vm.selectedItemParticipant_pmc.$edit      = false;
                        vm.selectedItemParticipant_pmc ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_pmc = vm.allparticipant_pmc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_pmc.id;
                      });
                      
                      vm.selectedItemModule_pmc.nbr_parti = parseInt(vm.selectedItemModule_pmc.nbr_parti)-1;
                      
                      if(parseInt(participant_pmc.sexe) == 2)
                      {
                        vm.selectedItemModule_pmc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_pmc.situation_participant_pmc = situ[0];
                  participant_pmc.id  =   String(data.response);              
                  NouvelItemParticipant_pmc=false;

                  vm.selectedItemModule_pmc.nbr_parti = parseInt(vm.selectedItemModule_pmc.nbr_parti)+1;
                  if(parseInt(participant_pmc.sexe) == 2)
                  {
                    vm.selectedItemModule_pmc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti)+1;
                  }
            }
              participant_pmc.$selected = false;
              participant_pmc.$edit = false;
              vm.selectedItemParticipant_pmc = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        /**********************************debut compte****************************************/


        /**********************************fin justificatif attachement****************************************/

//col table
        vm.rapport_pmc_column = [
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
          vm.selectedItemRapport_pmc.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemRapport_pmc.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterRapport_pmc = function ()
        { 
          if (NouvelItemRapport_pmc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              fichier: ''
            };
        
            vm.allrapport_pmc.push(items);
            vm.allrapport_pmc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRapport_pmc = mem;
              }
            });

            NouvelItemRapport_pmc = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport_pmc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutRapport_pmc(rapport_pmc,suppression)
        {
            if (NouvelItemRapport_pmc==false)
            {
                test_existanceRapport_pmc (rapport_pmc,suppression); 
            } 
            else
            {
                insert_in_baseRapport_pmc(rapport_pmc,suppression);
            }
        }

        //fonction de bouton d'annulation rapport_pmc
        vm.annulerRapport_pmc = function(item)
        {
          if (NouvelItemRapport_pmc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemRapport_pmc.intitule ;
            item.fichier   = currentItemRapport_pmc.fichier ;
          }else
          {
            vm.allrapport_pmc = vm.allrapport_pmc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRapport_pmc.id;
            });
          }

          vm.selectedItemRapport_pmc = {} ;
          NouvelItemRapport_pmc      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRapport_pmc= function (item)
        {
            vm.selectedItemRapport_pmc = item;
            vm.nouvelItemRapport_pmc   = item;
            currentItemRapport_pmc    = JSON.parse(JSON.stringify(vm.selectedItemRapport_pmc)); 
        };
        $scope.$watch('vm.selectedItemRapport_pmc', function()
        {
             if (!vm.allrapport_pmc) return;
             vm.allrapport_pmc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_pmc.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRapport_pmc = function(item)
        {
            NouvelItemRapport_pmc = false ;
            vm.selectedItemRapport_pmc = item;
            currentItemRapport_pmc = angular.copy(vm.selectedItemRapport_pmc);
            $scope.vm.allrapport_pmc.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemRapport_pmc.intitule ;
            item.fichier   = vm.selectedItemRapport_pmc.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item rapport_pmc
        vm.supprimerRapport_pmc = function()
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
                vm.ajoutRapport_pmc(vm.selectedItemRapport_pmc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRapport_pmc (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allrapport_pmc.filter(function(obj)
                {
                   return obj.id == currentItemRapport_pmc.id;
                });
                if(just[0])
                {
                   if((just[0].intitule   != currentItemRapport_pmc.intitule )
                    ||(just[0].fichier   != currentItemRapport_pmc.fichier ))                   
                      { 
                         insert_in_baseRapport_pmc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRapport_pmc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rapport_pmc
        function insert_in_baseRapport_pmc(rapport_pmc,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRapport_pmc==false)
            {
                getId = vm.selectedItemRapport_pmc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: rapport_pmc.intitule,
                    fichier: rapport_pmc.fichier,
                    id_module_pmc: vm.selectedItemModule_pmc.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_pmc/index",datas, config).success(function (data)
            {   

              if (NouvelItemRapport_pmc == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'rapport_pmc/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemRapport_pmc.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemModule_pmc.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    rapport_pmc.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      intitule: rapport_pmc.intitule,
                                                      fichier: rapport_pmc.fichier,
                                                      id_module_pmc: vm.selectedItemModule_pmc.id
                                        });
                                      apiFactory.add("rapport_pmc/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          rapport_pmc.$selected = false;
                                          rapport_pmc.$edit = false;
                                          vm.selectedItemRapport_pmc = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  rapport_pmc.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        intitule: rapport_pmc.intitule,
                                        fichier: rapport_pmc.fichier,
                                        id_module_pmc: vm.selectedItemModule_pmc.id               
                                    });
                                  apiFactory.add("rapport_pmc/index",datas, config).success(function (data)
                                  {
                                        
                                      rapport_pmc.$selected = false;
                                      rapport_pmc.$edit = false;
                                      vm.selectedItemRapport_pmc = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemRapport_pmc.$selected  = false;
                        vm.selectedItemRapport_pmc.$edit      = false;
                        vm.selectedItemRapport_pmc ={};
                    }
                    else 
                    {    
                      vm.allrapport_pmc = vm.allrapport_pmc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_pmc.id;
                      });
                      var chemin= vm.selectedItemRapport_pmc.fichier;
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
                  rapport_pmc.id  =   String(data.response);              
                  NouvelItemRapport_pmc = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'rapport_pmc/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemModule_pmc.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              rapport_pmc.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                intitule: rapport_pmc.intitule,
                                                fichier: rapport_pmc.fichier,
                                                id_module_pmc: vm.selectedItemModule_pmc.id
                                  });
                                apiFactory.add("rapport_pmc/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    rapport_pmc.$selected = false;
                                    rapport_pmc.$edit = false;
                                    vm.selectedItemRapport_pmc = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            rapport_pmc.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  intitule: rapport_pmc.intitule,
                                  fichier: rapport_pmc.fichier,
                                  id_module_pmc: vm.selectedItemModule_pmc.id               
                              });
                            apiFactory.add("rapport_pmc/index",datas, config).success(function (data)
                            {
                                  
                                rapport_pmc.$selected = false;
                                rapport_pmc.$edit = false;
                                vm.selectedItemRapport_pmc = {};
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
              rapport_pmc.$selected = false;
              rapport_pmc.$edit = false;
              vm.selectedItemRapport_pmc = {};

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
