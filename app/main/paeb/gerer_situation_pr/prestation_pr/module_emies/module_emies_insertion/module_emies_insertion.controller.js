(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_emies.module_emies_insertion')
        .controller('Module_emies_insertionController', Module_emies_insertionController);
    /** @ngInject */
    function Module_emies_insertionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
		   var vm = this;
        vm.selectedItemPartenaire_relai = {} ;
        vm.allpartenaire_relai = [] ;

        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutModule_emies = ajoutModule_emies ;
        var NouvelItemModule_emies=false;
        var currentItemModule_emies;
        vm.selectedItemModule_emies = {} ;
        vm.allmodule_emies = [] ;

        vm.allclassification_site =[];

        vm.ajoutParticipant_emies = ajoutParticipant_emies ;
        var NouvelItemParticipant_emies=false;
        var currentItemParticipant_emies;
        vm.selectedItemParticipant_emies = {} ;
        vm.allparticipant_emies = [] ;

        vm.allsituation_participant_emies = [] ;

        vm.ajoutRapport_emies = ajoutRapport_emies;
        var NouvelItemRapport_emies=false;
        var currentItemRapport_emies;
        vm.selectedItemRapport_emies = {} ;
        vm.allrapport_emies = [] ;

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

/**********************************debut bureau etude****************************************/
//col table
      /*  vm.partenaire_relai_column = [
        {titre:"Nom"},
        {titre:"Nif"},
        {titre:"Stat"},
        {titre:"Siege"},
        {titre:"telephone"}
        ];

                //recuperation donnée partenaire
        apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai = result.data.response;
        });

                //fonction selection item bureau etude
        vm.selectionPartenaire_relai = function (item)
        {
            vm.selectedItemPartenaire_relai = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemPartenaire_relai.id!=0)
            { 

              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratBypartenaire_relai','id_partenaire_relai',vm.selectedItemPartenaire_relai.id).then(function(result)
              {
                  vm.allcontrat_partenaire_relai = result.data.response; 
                  console.log(vm.allcontrat_partenaire_relai);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
            }           

        };
        $scope.$watch('vm.selectedItemPartenaire_relai', function()
        {
             if (!vm.allpartenaire_relai) return;
             vm.allpartenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPartenaire_relai.$selected = true;
        });
 
/**********************************fin bureau etude****************************************/ 

/**********************************debut contrat bureau etude****************************************/
//col table
       /* vm.contrat_partenaire_relai_column = [
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        }];

        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;

           if(item.id!=0)
           {
            vm.stepTwo = true;
            vm.stepThree = false;
            vm.stepFor = false;
              apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodule_emiesBycontrat','id_contrat_partenaire_relai',item.id).then(function(result)
              {
                  vm.allmodule_emies = result.data.response;
                  console.log(vm.allmodule_emies);

                  if (vm.allmodule_emies.length!=0)
                  {
                      vm.showbuttonNouvPassation=false;
                  }
              });
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_partenaire_relai', function()
        {
             if (!vm.allcontrat_partenaire_relai) return;
             vm.allcontrat_partenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_partenaire_relai.$selected = true;
        });*/
/**********************************fin contrat bureau etude****************************************/
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

  apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratBySansemies').then(function(result)
  {
      vm.allcontrat_partenaire_relai = result.data.response; 
      console.log(vm.allcontrat_partenaire_relai);
  });

  apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodule_emiesByinvalide').then(function(result)
  {
      vm.allmodule_emies = result.data.response;
      
      console.log(vm.allmodule_emies);

      if (result.data.response.length!=0)
      {
          vm.showbuttonNouvPassation=false;
      }
  });

//col table
        vm.module_emies_column = [
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
        {titre:"Nombre prévisionnel participant_emies"
        },
        {titre:"Nombre de participant_emies"
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


        apiFactory.getAll("situation_participant_emies/index").then(function(result)
        {
            vm.allsituation_participant_emies = result.data.response; 
                  console.log( vm.allsituation_participant_emies);
        });        
        //Masque de saisi ajout
        vm.ajouterModule_emies = function ()
        { 
          if (NouvelItemModule_emies == false)
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
            vm.allmodule_emies.push(items);
            vm.allmodule_emies.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_emies = mem;
              }
            });

            NouvelItemModule_emies = true ;
          }else
          {
            vm.showAlert('Ajout module_emies','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_emies(module_emies,suppression)
        {
            if (NouvelItemModule_emies==false)
            {
                test_existanceModule_emies (module_emies,suppression); 
            } 
            else
            {
                insert_in_baseModule_emies(module_emies,suppression);
            }
        }

        //fonction de bouton d'annulation module_emies
        vm.annulerModule_emies = function(item)
        {
          if (NouvelItemModule_emies == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_emies.observation ;
            item.date_debut_reel_form   = currentItemModule_emies.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_emies.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_emies.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_emies.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_emies.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_emies.date_fin_previ_form ;
            item.id_contrat_partenaire_relai  = currentItemModule_emies.id_contrat_partenaire_relai;
            item.id_classification_site = currentItemModule_emies.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_emies.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_emies.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_emies.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_emies.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_emies = vm.allmodule_emies.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_emies.id;
            });
          }

          vm.selectedItemModule_emies = {} ;
          NouvelItemModule_emies      = false;
          vm.showbuttonValidation = false;
          
        };

        //fonction selection item region
        vm.selectionModule_emies= function (item)
        {
            vm.selectedItemModule_emies = item;
            vm.nouvelItemModule_emies   = item;
            currentItemModule_emies    = JSON.parse(JSON.stringify(vm.selectedItemModule_emies));
            vm.showbuttonNouvRapport =true;

            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_emies/index",'id_module_emies',vm.selectedItemModule_emies.id).then(function(result)
              {
                  vm.allparticipant_emies = result.data.response; 
                  console.log( vm.allparticipant_emies);
              });

              apiFactory.getAPIgeneraliserREST("rapport_emies/index",'id_module_emies',vm.selectedItemModule_emies.id).then(function(result)
              {
                  vm.allrapport_emies = result.data.response; 
                  if (vm.allrapport_emies.length>0)
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
        $scope.$watch('vm.selectedItemModule_emies', function()
        {
             if (!vm.allmodule_emies) return;
             vm.allmodule_emies.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_emies.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierModule_emies = function(item)
        {
            NouvelItemModule_emies = false ;
            vm.selectedItemModule_emies = item;
            currentItemModule_emies = angular.copy(vm.selectedItemModule_emies);
            $scope.vm.allmodule_emies.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_emies.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_emies.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_emies.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_emies.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_emies.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_emies.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_emies.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_emies.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_emies.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_emies.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_emies.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_emies.lieu_formation;
            vm.showbuttonValidation = false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_emies = function()
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
                vm.ajoutModule_emies(vm.selectedItemModule_emies,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_emies (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_emies.filter(function(obj)
                {
                   return obj.id == currentItemModule_emies.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_emies.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_emies.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_emies.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_emies.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_emies.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_emies.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_emies.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_emies.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_emies.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_emies.date_fin_previ_form)
                    || (pass[0].id_contrat_partenaire_relai  != currentItemModule_emies.id_contrat_partenaire_relai ) )                   
                      { 
                         insert_in_baseModule_emies(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_emies(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_emies(module_emies,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_emies==false)
            {
                getId = vm.selectedItemModule_emies.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_emies.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_emies.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_emies.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_emies.date_reel_resti)),
                    nbr_previ_parti: module_emies.nbr_previ_parti,
                    nbr_previ_fem_parti: module_emies.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_emies.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_emies.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_emies.id_contrat_partenaire_relai,
                    lieu_formation: module_emies.lieu_formation,
                    observation:module_emies.observation,
                    validation:0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_emies/index",datas, config).success(function (data)
            {   
                var contrat_part= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == module_emies.id_contrat_partenaire_relai;
                });
                var classif= vm.allclassification_site.filter(function(obj)
                {
                    return obj.id == module_emies.id_classification_site;
                });


                if (NouvelItemModule_emies == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_emies.contrat_partenaire_relai = contrat_part[0];
                        vm.selectedItemModule_emies.classification_site= classif[0];
                        vm.selectedItemModule_emies.$selected  = false;
                        vm.selectedItemModule_emies.$edit      = false;
                        vm.selectedItemModule_emies ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_emies = vm.allmodule_emies.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_emies.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                  module_emies.contrat_partenaire_relai = contrat_part[0];
                  module_emies.classification_site = classif[0];

                  module_emies.id  =   String(data.response);              
                  NouvelItemModule_emies=false;
                  vm.showbuttonNouvPassation= false;
            }
              vm.showbuttonValidation = false;
              module_emies.$selected = false;
              module_emies.$edit = false;
              vm.selectedItemModule_emies = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_emies = function()
        {
          valide_insert_in_baseModule_emies(vm.selectedItemModule_emies,0);
        }

        function valide_insert_in_baseModule_emies(module_emies,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_emies==false)
            {
                getId = vm.selectedItemModule_emies.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_emies.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_emies.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_emies.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_emies.date_reel_resti)),
                    nbr_previ_parti: module_emies.nbr_previ_parti,
                    nbr_previ_fem_parti: module_emies.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_emies.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_emies.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_emies.contrat_partenaire_relai.id,
                    lieu_formation: module_emies.lieu_formation,
                    observation:module_emies.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_emies/index",datas, config).success(function (data)
            {   
                vm.allmodule_emies = vm.allmodule_emies.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemModule_emies.id;
                });
                vm.showbuttonValidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches_moe****************************************/

/**********************************debut participant_emies****************************************/
//col table
        vm.participant_emies_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_emies = function ()
        { 
          if (NouvelItemParticipant_emies == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_emies:''
            };         
            vm.allparticipant_emies.push(items);
            vm.allparticipant_emies.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_emies = mem;
              }
            });

            NouvelItemParticipant_emies = true ;
          }else
          {
            vm.showAlert('Ajout participant_emies','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_emies(participant_emies,suppression)
        {
            if (NouvelItemParticipant_emies==false)
            {
                test_existanceParticipant_emies (participant_emies,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_emies(participant_emies,suppression);
            }
        }

        //fonction de bouton d'annulation participant_emies
        vm.annulerParticipant_emies = function(item)
        {
          if (NouvelItemParticipant_emies == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_emies.nom ;
            item.prenom   = currentItemParticipant_emies.prenom ;
            item.sexe      = currentItemParticipant_emies.sexe;
            item.id_situation_participant_emies   = currentItemParticipant_emies.id_situation_participant_emies ; 
          }else
          {
            vm.allparticipant_emies = vm.allparticipant_emies.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_emies.id;
            });
          }

          vm.selectedItemParticipant_emies = {} ;
          NouvelItemParticipant_emies      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_emies= function (item)
        {
            vm.selectedItemParticipant_emies = item;
            vm.nouvelItemParticipant_emies   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_emies    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_emies));
            } 
        };
        $scope.$watch('vm.selectedItemParticipant_emies', function()
        {
             if (!vm.allparticipant_emies) return;
             vm.allparticipant_emies.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_emies.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_emies = function(item)
        {
            NouvelItemParticipant_emies = false ;
            vm.selectedItemParticipant_emies = item;
            currentItemParticipant_emies = angular.copy(vm.selectedItemParticipant_emies);
            $scope.vm.allparticipant_emies.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_emies.nom ;
            item.prenom = vm.selectedItemParticipant_emies.prenom;
            item.sexe  = vm.selectedItemParticipant_emies.sexe;
            item.id_situation_participant_emies = vm.selectedItemParticipant_emies.situation_participant_emies.id; 
        };

        //fonction bouton suppression item participant_emies
        vm.supprimerParticipant_emies = function()
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
                vm.ajoutParticipant_emies(vm.selectedItemParticipant_emies,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_emies (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_emies.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_emies.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_emies.nom) 
                    || (mem[0].prenom!=currentItemParticipant_emies.prenom)
                    || (mem[0].sexe!=currentItemParticipant_emies.sexe)
                    || (mem[0].age!=currentItemParticipant_emies.age)
                    || (mem[0].id_situation_participant_emies!=currentItemParticipant_emies.id_situation_participant_emies))                    
                      { 
                         insert_in_baseParticipant_emies(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_emies(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_emies(participant_emies,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_emies==false)
            {
                getId = vm.selectedItemParticipant_emies.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_emies.nom,
                    prenom: participant_emies.prenom,
                    sexe: participant_emies.sexe,
                    id_situation_participant_emies: participant_emies.id_situation_participant_emies,
                    id_module_emies: vm.selectedItemModule_emies.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_emies/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_emies.filter(function(obj)
                {
                    return obj.id == participant_emies.id_situation_participant_emies;
                });

                if (NouvelItemParticipant_emies == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_emies.situation_participant_emies= situ[0];
                        

                        if(currentItemParticipant_emies.sexe == 1 && currentItemParticipant_emies.sexe !=vm.selectedItemParticipant_emies.sexe)
                        {
                          vm.selectedItemModule_emies.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_emies.sexe == 2 && currentItemParticipant_emies.sexe !=vm.selectedItemParticipant_emies.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_emies.$selected  = false;
                        vm.selectedItemParticipant_emies.$edit      = false;
                        vm.selectedItemParticipant_emies ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_emies = vm.allparticipant_emies.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_emies.id;
                      });
                      
                      vm.selectedItemModule_emies.nbr_parti = parseInt(vm.selectedItemModule_emies.nbr_parti)-1;
                      
                      if(parseInt(participant_emies.sexe) == 2)
                      {
                        vm.selectedItemModule_emies.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_emies.situation_participant_emies = situ[0];
                  participant_emies.id  =   String(data.response);              
                  NouvelItemParticipant_emies=false;

                  vm.selectedItemModule_emies.nbr_parti = parseInt(vm.selectedItemModule_emies.nbr_parti)+1;
                  if(parseInt(participant_emies.sexe) == 2)
                  {
                    vm.selectedItemModule_emies.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti)+1;
                  }
            }
              participant_emies.$selected = false;
              participant_emies.$edit = false;
              vm.selectedItemParticipant_emies = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        /**********************************debut compte****************************************/


        /**********************************fin justificatif attachement****************************************/

//col table
        vm.rapport_emies_column = [
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
          vm.selectedItemRapport_emies.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemRapport_emies.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterRapport_emies = function ()
        { 
          if (NouvelItemRapport_emies == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              fichier: ''
            };
        
            vm.allrapport_emies.push(items);
            vm.allrapport_emies.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRapport_emies = mem;
              }
            });

            NouvelItemRapport_emies = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport_emies','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutRapport_emies(rapport_emies,suppression)
        {
            if (NouvelItemRapport_emies==false)
            {
                test_existanceRapport_emies (rapport_emies,suppression); 
            } 
            else
            {
                insert_in_baseRapport_emies(rapport_emies,suppression);
            }
        }

        //fonction de bouton d'annulation rapport_emies
        vm.annulerRapport_emies = function(item)
        {
          if (NouvelItemRapport_emies == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemRapport_emies.intitule ;
            item.fichier   = currentItemRapport_emies.fichier ;
          }else
          {
            vm.allrapport_emies = vm.allrapport_emies.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRapport_emies.id;
            });
          }

          vm.selectedItemRapport_emies = {} ;
          NouvelItemRapport_emies      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRapport_emies= function (item)
        {
            vm.selectedItemRapport_emies = item;
            vm.nouvelItemRapport_emies   = item;
            currentItemRapport_emies    = JSON.parse(JSON.stringify(vm.selectedItemRapport_emies)); 
        };
        $scope.$watch('vm.selectedItemRapport_emies', function()
        {
             if (!vm.allrapport_emies) return;
             vm.allrapport_emies.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_emies.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRapport_emies = function(item)
        {
            NouvelItemRapport_emies = false ;
            vm.selectedItemRapport_emies = item;
            currentItemRapport_emies = angular.copy(vm.selectedItemRapport_emies);
            $scope.vm.allrapport_emies.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemRapport_emies.intitule ;
            item.fichier   = vm.selectedItemRapport_emies.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item rapport_emies
        vm.supprimerRapport_emies = function()
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
                vm.ajoutRapport_emies(vm.selectedItemRapport_emies,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRapport_emies (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allrapport_emies.filter(function(obj)
                {
                   return obj.id == currentItemRapport_emies.id;
                });
                if(just[0])
                {
                   if((just[0].intitule   != currentItemRapport_emies.intitule )
                    ||(just[0].fichier   != currentItemRapport_emies.fichier ))                   
                      { 
                         insert_in_baseRapport_emies(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRapport_emies(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rapport_emies
        function insert_in_baseRapport_emies(rapport_emies,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRapport_emies==false)
            {
                getId = vm.selectedItemRapport_emies.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: rapport_emies.intitule,
                    fichier: rapport_emies.fichier,
                    id_module_emies: vm.selectedItemModule_emies.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_emies/index",datas, config).success(function (data)
            {   

              if (NouvelItemRapport_emies == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'rapport_emies/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemRapport_emies.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemModule_emies.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    rapport_emies.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      intitule: rapport_emies.intitule,
                                                      fichier: rapport_emies.fichier,
                                                      id_module_emies: vm.selectedItemModule_emies.id
                                        });
                                      apiFactory.add("rapport_emies/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          rapport_emies.$selected = false;
                                          rapport_emies.$edit = false;
                                          vm.selectedItemRapport_emies = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  rapport_emies.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        intitule: rapport_emies.intitule,
                                        fichier: rapport_emies.fichier,
                                        id_module_emies: vm.selectedItemModule_emies.id               
                                    });
                                  apiFactory.add("rapport_emies/index",datas, config).success(function (data)
                                  {
                                        
                                      rapport_emies.$selected = false;
                                      rapport_emies.$edit = false;
                                      vm.selectedItemRapport_emies = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemRapport_emies.$selected  = false;
                        vm.selectedItemRapport_emies.$edit      = false;
                        vm.selectedItemRapport_emies ={};
                    }
                    else 
                    {    
                      vm.allrapport_emies = vm.allrapport_emies.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_emies.id;
                      });
                      var chemin= vm.selectedItemRapport_emies.fichier;
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
                  rapport_emies.id  =   String(data.response);              
                  NouvelItemRapport_emies = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'rapport_emies/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemModule_emies.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              rapport_emies.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                intitule: rapport_emies.intitule,
                                                fichier: rapport_emies.fichier,
                                                id_module_emies: vm.selectedItemModule_emies.id
                                  });
                                apiFactory.add("rapport_emies/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    rapport_emies.$selected = false;
                                    rapport_emies.$edit = false;
                                    vm.selectedItemRapport_emies = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            rapport_emies.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  intitule: rapport_emies.intitule,
                                  fichier: rapport_emies.fichier,
                                  id_module_emies: vm.selectedItemModule_emies.id               
                              });
                            apiFactory.add("rapport_emies/index",datas, config).success(function (data)
                            {
                                  
                                rapport_emies.$selected = false;
                                rapport_emies.$edit = false;
                                vm.selectedItemRapport_emies = {};
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
              rapport_emies.$selected = false;
              rapport_emies.$edit = false;
              vm.selectedItemRapport_emies = {};

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
