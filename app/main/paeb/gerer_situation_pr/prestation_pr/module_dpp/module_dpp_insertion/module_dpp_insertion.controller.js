(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.prestation_pr.module_dpp.module_dpp_insertion')
        .controller('Module_dpp_insertionController', Module_dpp_insertionController);
    /** @ngInject */
    function Module_dpp_insertionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		   var vm = this;
        vm.selectedItemPartenaire_relai = {} ;
        vm.allpartenaire_relai = [] ;

        //vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutModule_dpp = ajoutModule_dpp ;
        var NouvelItemModule_dpp=false;
        var currentItemModule_dpp;
        vm.selectedItemModule_dpp = {} ;
        vm.allmodule_dpp = [] ;

        vm.allclassification_site =[];

        vm.ajoutParticipant_dpp = ajoutParticipant_dpp ;
        var NouvelItemParticipant_dpp=false;
        var currentItemParticipant_dpp;
        vm.selectedItemParticipant_dpp = {} ;
        vm.allparticipant_dpp = [] ;

        vm.allsituation_participant_dpp = [] ;

        vm.ajoutRapport_dpp = ajoutRapport_dpp;
        var NouvelItemRapport_dpp=false;
        var currentItemRapport_dpp;
        vm.selectedItemRapport_dpp = {} ;
        vm.allrapport_dpp = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;

        vm.showbuttonNouvPassation=true;
        vm.showbuttonNouvRapport =true;
        vm.showbuttonValider = false;
        vm.date_now         = new Date();

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
        });*/
 
/**********************************fin bureau etude****************************************/ 

/**********************************debut contrat bureau etude****************************************/
//col table
      /*  vm.contrat_partenaire_relai_column = [
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
              apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodule_dppBycontrat','id_contrat_partenaire_relai',item.id).then(function(result)
              {
                  vm.allmodule_dpp = result.data.response.filter(function(obj)
                {
                   return obj.validation == 0;
                });
                  console.log(vm.allmodule_dpp);

                  if (result.data.response.length!=0)
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


/**********************************debut passation_marches_moe****************************************/

  apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratBySansdpp').then(function(result)
  {
      vm.allcontrat_partenaire_relai = result.data.response; 
      console.log(vm.allcontrat_partenaire_relai);
  });

  apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodule_dppByinvalide').then(function(result)
  {
      vm.allmodule_dpp = result.data.response;
      
      console.log(vm.allmodule_dpp);

      if (result.data.response.length!=0)
      {
          vm.showbuttonNouvPassation=false;
      }
  });
//col table
        vm.module_dpp_column = [
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
        {titre:"Nombre prévisionnel participant_dpp"
        },
        {titre:"Nombre de participant_dpp"
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


        apiFactory.getAll("situation_participant_dpp/index").then(function(result)
        {
            vm.allsituation_participant_dpp = result.data.response; 
                  console.log( vm.allsituation_participant_dpp);
        });        
        //Masque de saisi ajout
        vm.ajouterModule_dpp = function ()
        { 
          if (NouvelItemModule_dpp == false)
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
            vm.allmodule_dpp.push(items);
            vm.allmodule_dpp.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_dpp = mem;
              }
            });

            NouvelItemModule_dpp = true ;
          }else
          {
            vm.showAlert('Ajout module_dpp','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_dpp(module_dpp,suppression)
        {
            if (NouvelItemModule_dpp==false)
            {
                test_existanceModule_dpp (module_dpp,suppression); 
            } 
            else
            {
                insert_in_baseModule_dpp(module_dpp,suppression);
            }
        }

        //fonction de bouton d'annulation module_dpp
        vm.annulerModule_dpp = function(item)
        {
          if (NouvelItemModule_dpp == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_dpp.observation ;
            item.date_debut_reel_form   = currentItemModule_dpp.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_dpp.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_dpp.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_dpp.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_dpp.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_dpp.date_fin_previ_form ;
            item.id_contrat_partenaire_relai  = currentItemModule_dpp.id_contrat_partenaire_relai;
            item.id_classification_site = currentItemModule_dpp.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_dpp.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_dpp.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_dpp.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_dpp.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_dpp = vm.allmodule_dpp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_dpp.id;
            });
          }

          vm.selectedItemModule_dpp = {} ;
          NouvelItemModule_dpp      = false;
          
        };

        //fonction selection item region
        vm.selectionModule_dpp= function (item)
        {
            vm.selectedItemModule_dpp = item;
            vm.nouvelItemModule_dpp   = item;
            currentItemModule_dpp    = JSON.parse(JSON.stringify(vm.selectedItemModule_dpp));
            vm.showbuttonNouvRapport =true;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_dpp/index",'id_module_dpp',vm.selectedItemModule_dpp.id).then(function(result)
              {
                  vm.allparticipant_dpp = result.data.response; 
                  console.log( vm.allparticipant_dpp);
              });
              vm.showbuttonValider = true;
              apiFactory.getAPIgeneraliserREST("rapport_dpp/index",'id_module_dpp',vm.selectedItemModule_dpp.id).then(function(result)
              {
                  vm.allrapport_dpp = result.data.response; 
                  if (vm.allrapport_dpp.length>0)
                  {
                    vm.showbuttonNouvRapport =false;
                  }
              });


              vm.stepOne = true;
              vm.stepTwo = false;
            }
        };
        $scope.$watch('vm.selectedItemModule_dpp', function()
        {
             if (!vm.allmodule_dpp) return;
             vm.allmodule_dpp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_dpp.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierModule_dpp = function(item)
        {
            NouvelItemModule_dpp = false ;
            vm.selectedItemModule_dpp = item;
            currentItemModule_dpp = angular.copy(vm.selectedItemModule_dpp);
            $scope.vm.allmodule_dpp.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_dpp.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_dpp.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_dpp.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_dpp.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_dpp.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_dpp.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_dpp.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_dpp.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_dpp.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_dpp.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_dpp.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_dpp.lieu_formation;
            vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_dpp.contrat_partenaire_relai);
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_dpp = function()
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
                vm.ajoutModule_dpp(vm.selectedItemModule_dpp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_dpp (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_dpp.filter(function(obj)
                {
                   return obj.id == currentItemModule_dpp.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_dpp.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_dpp.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_dpp.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_dpp.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_dpp.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_dpp.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_dpp.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_dpp.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_dpp.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_dpp.date_fin_previ_form)
                    || (pass[0].id_contrat_partenaire_relai  != currentItemModule_dpp.contrat_partenaire_relai.id ) )                   
                      { 
                         insert_in_baseModule_dpp(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_dpp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_dpp(module_dpp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_dpp==false)
            {
                getId = vm.selectedItemModule_dpp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_dpp.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_dpp.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_dpp.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_dpp.date_reel_resti)),
                    nbr_previ_parti: module_dpp.nbr_previ_parti,
                    nbr_previ_fem_parti: module_dpp.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_dpp.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_dpp.date_fin_previ_form)),
                    id_contrat_partenaire_relai: module_dpp.id_contrat_partenaire_relai,
                    lieu_formation: module_dpp.lieu_formation,
                    observation:module_dpp.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_dpp/index",datas, config).success(function (data)
            {   
                var contrat_part= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == module_dpp.id_contrat_partenaire_relai;
                });
                var classif= vm.allclassification_site.filter(function(obj)
                {
                    return obj.id == module_dpp.id_classification_site;
                });


                if (NouvelItemModule_dpp == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_dpp.contrat_partenaire_relai = contrat_part[0];
                        vm.selectedItemModule_dpp.classification_site= classif[0];
                        vm.selectedItemModule_dpp.$selected  = false;
                        vm.selectedItemModule_dpp.$edit      = false;
                        vm.selectedItemModule_dpp ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_dpp = vm.allmodule_dpp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_dpp.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                  module_dpp.contrat_partenaire_relai = contrat_part[0];
                  module_dpp.classification_site = classif[0];

                  module_dpp.id  =   String(data.response);              
                  NouvelItemModule_dpp=false;
                  vm.showbuttonNouvPassation= false;
            }
              module_dpp.$selected = false;
              module_dpp.$edit = false;
              vm.selectedItemModule_dpp = {};
              vm.showbuttonValider = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_dpp = function()
        {
          valide_insert_in_baseModule_dpp(vm.selectedItemModule_dpp,0);
        }

        function valide_insert_in_baseModule_dpp(module_dpp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_dpp==false)
            {
                getId = vm.selectedItemModule_dpp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_dpp.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_dpp.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_dpp.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_dpp.date_reel_resti)),
                    nbr_previ_parti: module_dpp.nbr_previ_parti,
                    nbr_previ_fem_parti: module_dpp.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_dpp.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_dpp.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_dpp.lieu_formation,
                    observation:module_dpp.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_dpp/index",datas, config).success(function (data)
            {   
                vm.allmodule_dpp = vm.allmodule_dpp.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemModule_dpp.id;
                });
                vm.showbuttonValider = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches_moe****************************************/

/**********************************debut participant_dpp****************************************/
//col table
        vm.participant_dpp_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_dpp = function ()
        { 
          if (NouvelItemParticipant_dpp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_dpp:''
            };         
            vm.allparticipant_dpp.push(items);
            vm.allparticipant_dpp.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_dpp = mem;
              }
            });

            NouvelItemParticipant_dpp = true ;
          }else
          {
            vm.showAlert('Ajout participant_dpp','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_dpp(participant_dpp,suppression)
        {
            if (NouvelItemParticipant_dpp==false)
            {
                test_existanceParticipant_dpp (participant_dpp,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_dpp(participant_dpp,suppression);
            }
        }

        //fonction de bouton d'annulation participant_dpp
        vm.annulerParticipant_dpp = function(item)
        {
          if (NouvelItemParticipant_dpp == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_dpp.nom ;
            item.prenom   = currentItemParticipant_dpp.prenom ;
            item.sexe      = currentItemParticipant_dpp.sexe;
            item.id_situation_participant_dpp   = currentItemParticipant_dpp.id_situation_participant_dpp ; 
          }else
          {
            vm.allparticipant_dpp = vm.allparticipant_dpp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_dpp.id;
            });
          }

          vm.selectedItemParticipant_dpp = {} ;
          NouvelItemParticipant_dpp      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_dpp= function (item)
        {
            vm.selectedItemParticipant_dpp = item;
            vm.nouvelItemParticipant_dpp   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_dpp    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_dpp));
            } 
        };
        $scope.$watch('vm.selectedItemParticipant_dpp', function()
        {
             if (!vm.allparticipant_dpp) return;
             vm.allparticipant_dpp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_dpp.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_dpp = function(item)
        {
            NouvelItemParticipant_dpp = false ;
            vm.selectedItemParticipant_dpp = item;
            currentItemParticipant_dpp = angular.copy(vm.selectedItemParticipant_dpp);
            $scope.vm.allparticipant_dpp.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_dpp.nom ;
            item.prenom = vm.selectedItemParticipant_dpp.prenom;
            item.sexe  = vm.selectedItemParticipant_dpp.sexe;
            item.id_situation_participant_dpp = vm.selectedItemParticipant_dpp.situation_participant_dpp.id; 
        };

        //fonction bouton suppression item participant_dpp
        vm.supprimerParticipant_dpp = function()
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
                vm.ajoutParticipant_dpp(vm.selectedItemParticipant_dpp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_dpp (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_dpp.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_dpp.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_dpp.nom) 
                    || (mem[0].prenom!=currentItemParticipant_dpp.prenom)
                    || (mem[0].sexe!=currentItemParticipant_dpp.sexe)
                    || (mem[0].age!=currentItemParticipant_dpp.age)
                    || (mem[0].id_situation_participant_dpp!=currentItemParticipant_dpp.id_situation_participant_dpp))                    
                      { 
                         insert_in_baseParticipant_dpp(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_dpp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_dpp(participant_dpp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_dpp==false)
            {
                getId = vm.selectedItemParticipant_dpp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_dpp.nom,
                    prenom: participant_dpp.prenom,
                    sexe: participant_dpp.sexe,
                    id_situation_participant_dpp: participant_dpp.id_situation_participant_dpp,
                    id_module_dpp: vm.selectedItemModule_dpp.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_dpp/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_dpp.filter(function(obj)
                {
                    return obj.id == participant_dpp.id_situation_participant_dpp;
                });

                if (NouvelItemParticipant_dpp == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_dpp.situation_participant_dpp= situ[0];
                        

                        if(currentItemParticipant_dpp.sexe == 1 && currentItemParticipant_dpp.sexe !=vm.selectedItemParticipant_dpp.sexe)
                        {
                          vm.selectedItemModule_dpp.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_dpp.sexe == 2 && currentItemParticipant_dpp.sexe !=vm.selectedItemParticipant_dpp.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_dpp.$selected  = false;
                        vm.selectedItemParticipant_dpp.$edit      = false;
                        vm.selectedItemParticipant_dpp ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_dpp = vm.allparticipant_dpp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_dpp.id;
                      });
                      
                      vm.selectedItemModule_dpp.nbr_parti = parseInt(vm.selectedItemModule_dpp.nbr_parti)-1;
                      
                      if(parseInt(participant_dpp.sexe) == 2)
                      {
                        vm.selectedItemModule_dpp.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_dpp.situation_participant_dpp = situ[0];
                  participant_dpp.id  =   String(data.response);              
                  NouvelItemParticipant_dpp=false;

                  vm.selectedItemModule_dpp.nbr_parti = parseInt(vm.selectedItemModule_dpp.nbr_parti)+1;
                  if(parseInt(participant_dpp.sexe) == 2)
                  {
                    vm.selectedItemModule_dpp.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti)+1;
                  }
            }
              participant_dpp.$selected = false;
              participant_dpp.$edit = false;
              vm.selectedItemParticipant_dpp = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        /**********************************debut compte****************************************/
/**********************************fin justificatif attachement****************************************/

//col table
        vm.rapport_dpp_column = [
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
          vm.selectedItemRapport_dpp.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemRapport_dpp.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterRapport_dpp = function ()
        { 
          if (NouvelItemRapport_dpp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              fichier: ''
            };
        
            vm.allrapport_dpp.push(items);
            vm.allrapport_dpp.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRapport_dpp = mem;
              }
            });

            NouvelItemRapport_dpp = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport_dpp','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutRapport_dpp(rapport_dpp,suppression)
        {
            if (NouvelItemRapport_dpp==false)
            {
                test_existanceRapport_dpp (rapport_dpp,suppression); 
            } 
            else
            {
                insert_in_baseRapport_dpp(rapport_dpp,suppression);
            }
        }

        //fonction de bouton d'annulation rapport_dpp
        vm.annulerRapport_dpp = function(item)
        {
          if (NouvelItemRapport_dpp == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemRapport_dpp.intitule ;
            item.fichier   = currentItemRapport_dpp.fichier ;
          }else
          {
            vm.allrapport_dpp = vm.allrapport_dpp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRapport_dpp.id;
            });
          }

          vm.selectedItemRapport_dpp = {} ;
          NouvelItemRapport_dpp      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRapport_dpp= function (item)
        {
            vm.selectedItemRapport_dpp = item;
            vm.nouvelItemRapport_dpp   = item;
            currentItemRapport_dpp    = JSON.parse(JSON.stringify(vm.selectedItemRapport_dpp)); 
        };
        $scope.$watch('vm.selectedItemRapport_dpp', function()
        {
             if (!vm.allrapport_dpp) return;
             vm.allrapport_dpp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_dpp.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRapport_dpp = function(item)
        {
            NouvelItemRapport_dpp = false ;
            vm.selectedItemRapport_dpp = item;
            currentItemRapport_dpp = angular.copy(vm.selectedItemRapport_dpp);
            $scope.vm.allrapport_dpp.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemRapport_dpp.intitule ;
            item.fichier   = vm.selectedItemRapport_dpp.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item rapport_dpp
        vm.supprimerRapport_dpp = function()
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
                vm.ajoutRapport_dpp(vm.selectedItemRapport_dpp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRapport_dpp (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.allrapport_dpp.filter(function(obj)
                {
                   return obj.id == currentItemRapport_dpp.id;
                });
                if(just[0])
                {
                   if((just[0].intitule   != currentItemRapport_dpp.intitule )
                    ||(just[0].fichier   != currentItemRapport_dpp.fichier ))                   
                      { 
                         insert_in_baseRapport_dpp(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRapport_dpp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rapport_dpp
        function insert_in_baseRapport_dpp(rapport_dpp,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRapport_dpp==false)
            {
                getId = vm.selectedItemRapport_dpp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: rapport_dpp.intitule,
                    fichier: rapport_dpp.fichier,
                    id_module_dpp: vm.selectedItemModule_dpp.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_dpp/index",datas, config).success(function (data)
            {   

              if (NouvelItemRapport_dpp == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'rapport_dpp/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemRapport_dpp.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemModule_dpp.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    rapport_dpp.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      intitule: rapport_dpp.intitule,
                                                      fichier: rapport_dpp.fichier,
                                                      id_module_dpp: vm.selectedItemModule_dpp.id
                                        });
                                      apiFactory.add("rapport_dpp/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          rapport_dpp.$selected = false;
                                          rapport_dpp.$edit = false;
                                          vm.selectedItemRapport_dpp = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  rapport_dpp.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        intitule: rapport_dpp.intitule,
                                        fichier: rapport_dpp.fichier,
                                        id_module_dpp: vm.selectedItemModule_dpp.id               
                                    });
                                  apiFactory.add("rapport_dpp/index",datas, config).success(function (data)
                                  {
                                        
                                      rapport_dpp.$selected = false;
                                      rapport_dpp.$edit = false;
                                      vm.selectedItemRapport_dpp = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemRapport_dpp.$selected  = false;
                        vm.selectedItemRapport_dpp.$edit      = false;
                        vm.selectedItemRapport_dpp ={};
                    }
                    else 
                    {    
                      vm.allrapport_dpp = vm.allrapport_dpp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_dpp.id;
                      });
                      var chemin= vm.selectedItemRapport_dpp.fichier;
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
                  rapport_dpp.id  =   String(data.response);              
                  NouvelItemRapport_dpp = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'rapport_dpp/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemModule_dpp.contrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              rapport_dpp.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                intitule: rapport_dpp.intitule,
                                                fichier: rapport_dpp.fichier,
                                                id_module_dpp: vm.selectedItemModule_dpp.id
                                  });
                                apiFactory.add("rapport_dpp/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    rapport_dpp.$selected = false;
                                    rapport_dpp.$edit = false;
                                    vm.selectedItemRapport_dpp = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            rapport_dpp.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  intitule: rapport_dpp.intitule,
                                  fichier: rapport_dpp.fichier,
                                  id_module_dpp: vm.selectedItemModule_dpp.id               
                              });
                            apiFactory.add("rapport_dpp/index",datas, config).success(function (data)
                            {
                                  
                                rapport_dpp.$selected = false;
                                rapport_dpp.$edit = false;
                                vm.selectedItemRapport_dpp = {};
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
              rapport_dpp.$selected = false;
              rapport_dpp.$edit = false;
              vm.selectedItemRapport_dpp = {};

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
