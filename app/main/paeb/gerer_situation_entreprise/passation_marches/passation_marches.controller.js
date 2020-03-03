(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.passation_marches')
        .controller('Passation_marchesController', Passation_marchesController);
    /** @ngInject */
    function Passation_marchesController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
       /* vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;*/
        vm.selectedItemPrestataire = {} ;
        vm.allprestataire = [] ;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutPassation_marches = ajoutPassation_marches ;
        var NouvelItemPassation_marches=false;
        var currentItemPassation_marches;
        vm.selectedItemPassation_marches = {} ;
        vm.allpassation_marches = [] ;

        vm.ajoutMpe_soumissionaire = ajoutMpe_soumissionaire ;
        var NouvelItemMpe_soumissionaire=false;
        var currentItemMpe_soumissionaire;
        vm.selectedItemMpe_soumissionaire = {} ;
        vm.allmpe_soumissionaire = [] ;

        vm.allprestataire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.showbuttonNouvPassation=true;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
/**********************************debut prestataire****************************************/
//col table
        vm.prestataire_column = [
        {titre:"Nom"},
        {titre:"Nif"},
        {titre:"Stat"},
        {titre:"Siege"},
        {titre:"telephone"}
        ];
        //recuperation donnée prestataire
        apiFactory.getAll("prestataire/index").then(function(result)
        {
            vm.allprestataire = result.data.response; 
            console.log(vm.allprestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionPrestataire = function (item)
        {
            vm.selectedItemPrestataire = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemPrestataire.id!=0)
            { 

              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menu','getcontratByprestataire','id_prestataire',vm.selectedItemPrestataire.id).then(function(result)
              {
                  vm.allcontrat_prestataire = result.data.response; 
                  console.log(vm.allcontrat_prestataire);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemPrestataire', function()
        {
             if (!vm.allprestataire) return;
             vm.allprestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPrestataire.$selected = true;
        });

/**********************************fin prestataire****************************************/

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
        }];

        //fonction selection item region
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           if(item.id!=0)
           {
              apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationBycontrat_prestataire','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.allpassation_marches = result.data.response;
                  console.log(vm.allpassation_marches);

                  if (vm.allpassation_marches.length!=0)
                  {
                      vm.showbuttonNouvPassation=false;
                  }
              });

              apiFactory.getOne("convention_cisco_feffi_entete/index",item.convention_entete.id).then(function(result)
              {
                  vm.allconvention_entete = result.data.response;
                  console.log(vm.allconvention_entete);
              });

            vm.stepTwo = true;
            vm.stepThree = false;
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

/**********************************debut contrat****************************************/

/**********************************fin contrat****************************************/



        //col table
    /*    vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        }];
 */
/**********************************debut convention entete****************************************/       
        //recuperation donnée convention
    /*    apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention_entete = result.data.response; 
            console.log(vm.allconvention_entete);
        });

        //recuperation donnée prestataire
        apiFactory.getAll("prestataire/index").then(function(result)
        {
            vm.allprestataire= result.data.response;
            console.log(vm.allprestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemConvention_entete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allpassation_marches = result.data.response;

                  if (vm.allpassation_marches.length!=0)
                  {
                    vm.showbuttonNouvPassation=false;
                  }
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
        });     */   

/**********************************fin convention entete****************************************/

/**********************************debut passation_marches****************************************/
//col table
        vm.passation_marches_column = [
        {titre:"Date lancement"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre offre reçu"
        },
        {titre:"montant moins chere"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date OS"
        },
        {titre:"Observention"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterPassation_marches = function ()
        { 
          if (NouvelItemPassation_marches == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              date_lancement: '',
              date_remise: '',
              nbr_offre_recu: 0,
              montant_moin_chere:'',
              date_rapport_evaluation:'',
              date_demande_ano_dpfi: '',
              date_ano_dpfi: '',
              notification_intention: '',
              date_notification_attribution:'',
              observation:''
            };         
            vm.allpassation_marches.push(items);
           
            vm.selectedItemPassation_marches = items;             

            NouvelItemPassation_marches = true ;
          }else
          {
            vm.showAlert('Ajout passation_marches','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPassation_marches(passation_marches,suppression)
        {
            if (NouvelItemPassation_marches==false)
            {
                test_existancePassation_marches (passation_marches,suppression); 
            } 
            else
            {
                insert_in_basePassation_marches(passation_marches,suppression);
            }
        }

        //fonction de bouton d'annulation passation_marches
        vm.annulerPassation_marches = function(item)
        {
          if (NouvelItemPassation_marches == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemPassation_marches.observation ;
            item.date_os   = currentItemPassation_marches.date_os ;
            item.date_remise   = currentItemPassation_marches.date_remise ;
            item.date_ano_dpfi = currentItemPassation_marches.date_ano_dpfi ;
            item.nbr_offre_recu = currentItemPassation_marches.nbr_offre_recu;
            item.date_lancement = currentItemPassation_marches.date_lancement ; 
            item.montant_moin_chere = currentItemPassation_marches.montant_moin_chere ;
            item.date_demande_ano_dpfi    = currentItemPassation_marches.date_demande_ano_dpfi ;
            item.date_rapport_evaluation  = currentItemPassation_marches.date_rapport_evaluation ;
            item.notification_intention   = currentItemPassation_marches.notification_intention;
            item.date_notification_attribution  = currentItemPassation_marches.date_notification_attribution ;
          }else
          {
            vm.allpassation_marches = vm.allpassation_marches.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPassation_marches.id;
            });
          }

          vm.selectedItemPassation_marches = {} ;
          NouvelItemPassation_marches      = false;
          
        };

        //fonction selection item region
        vm.selectionPassation_marches= function (item)
        {
            vm.selectedItemPassation_marches = item;
            vm.nouvelItemPassation_marches   = item;
            if (item.$selected = false)
            {
              currentItemPassation_marches    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches));
            }
            
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("mpe_soumissionaire/index",'id_passation_marches',vm.selectedItemPassation_marches.id).then(function(result)
            {
                vm.allmpe_soumissionaire = result.data.response;
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemPassation_marches', function()
        {
             if (!vm.allpassation_marches) return;
             vm.allpassation_marches.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPassation_marches.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPassation_marches = function(item)
        {
            NouvelItemPassation_marches = false ;
            vm.selectedItemPassation_marches = item;
            currentItemPassation_marches = angular.copy(vm.selectedItemPassation_marches);
            $scope.vm.allpassation_marches.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemPassation_marches.observation ;
            item.date_os   = new Date(vm.selectedItemPassation_marches.date_os );
            item.date_remise   = new Date(vm.selectedItemPassation_marches.date_remise );
            item.date_ano_dpfi = new Date(vm.selectedItemPassation_marches.date_ano_dpfi);
            item.nbr_offre_recu = vm.selectedItemPassation_marches.nbr_offre_recu;
            item.date_lancement = new Date(vm.selectedItemPassation_marches.date_lancement) ;
            item.montant_moin_chere = vm.selectedItemPassation_marches.montant_moin_chere ;
            item.date_demande_ano_dpfi    = new Date(vm.selectedItemPassation_marches.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = new Date(vm.selectedItemPassation_marches.date_rapport_evaluation) ;
            item.notification_intention   = new Date(vm.selectedItemPassation_marches.notification_intention);
            item.date_notification_attribution  = new Date(vm.selectedItemPassation_marches.date_notification_attribution) ;
        };

        //fonction bouton suppression item passation_marches
        vm.supprimerPassation_marches = function()
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
                vm.ajoutPassation_marches(vm.selectedItemPassation_marches,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePassation_marches (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpassation_marches.filter(function(obj)
                {
                   return obj.id == currentItemPassation_marches.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemPassation_marches.observation )
                    || (pass[0].date_os   != currentItemPassation_marches.date_os )
                    || (pass[0].date_remise   != currentItemPassation_marches.date_remise )
                    || (pass[0].date_ano_dpfi != currentItemPassation_marches.date_ano_dpfi )
                    || (pass[0].nbr_offre_recu != currentItemPassation_marches.nbr_offre_recu)
                    || (pass[0].date_lancement != currentItemPassation_marches.date_lancement ) 
                    || (pass[0].montant_moin_chere != currentItemPassation_marches.montant_moin_chere )
                    || (pass[0].date_demande_ano_dpfi    != currentItemPassation_marches.date_demande_ano_dpfi )
                    || (pass[0].date_rapport_evaluation  != currentItemPassation_marches.date_rapport_evaluation )
                    || (pass[0].notification_intention   != currentItemPassation_marches.notification_intention)
                    || (pass[0].date_notification_attribution  != currentItemPassation_marches.date_notification_attribution ) )                   
                      { 
                         insert_in_basePassation_marches(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePassation_marches(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePassation_marches(passation_marches,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPassation_marches==false)
            {
                getId = vm.selectedItemPassation_marches.id; 
            } 
            console.log(vm.selectedItemPassation_marches);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement: convertionDate(new Date(passation_marches.date_lancement)),
                    date_os: convertionDate(new Date(passation_marches.date_os)),
                    date_remise: convertionDate(new Date(passation_marches.date_remise)),
                    montant_moin_chere:passation_marches.montant_moin_chere,
                    date_rapport_evaluation:convertionDate(new Date(passation_marches.date_rapport_evaluation)),
                    date_demande_ano_dpfi: convertionDate(new Date(passation_marches.date_demande_ano_dpfi)),
                    date_ano_dpfi: convertionDate(new Date(passation_marches.date_ano_dpfi)),
                    notification_intention: convertionDate(new Date(passation_marches.notification_intention)),
                    date_notification_attribution: convertionDate(new Date(passation_marches.date_notification_attribution)),                    
                    observation:passation_marches.observation,
                    id_convention_entete: vm.allconvention_entete[0].id,
                    validation:0,               
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches/index",datas, config).success(function (data)
            {   
                var pres= vm.allprestataire.filter(function(obj)
                {
                    return obj.id == passation_marches.id_prestataire;
                });

                if (NouvelItemPassation_marches == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                       /* vm.selectedItemPassation_marches.observation   = passation_marches.observation ;
                        vm.selectedItemPassation_marches.date_os   = passation_marches.date_os ;
                        vm.selectedItemPassation_marches.date_remise   = passation_marches.date_remise ;
                        vm.selectedItemPassation_marches.date_ano_dpfi = passation_marches.date_ano_dpfi ;
                        vm.selectedItemPassation_marches.nbr_offre_recu = passation_marches.nbr_offre_recu;
                        vm.selectedItemPassation_marches.date_lancement = passation_marches.date_lancement ;
                        vm.selectedItemPassation_marches.prestataire = pres[0]; 
                        vm.selectedItemPassation_marches.montant_moin_chere = passation_marches.montant_moin_chere;
                        vm.selectedItemPassation_marches.date_signature_contrat   = passation_marches.date_signature_contrat ;
                        vm.selectedItemPassation_marches.date_demande_ano_dpfi    = passation_marches.date_demande_ano_dpfi ;
                        vm.selectedItemPassation_marches.date_rapport_evaluation  = passation_marches.date_rapport_evaluation ;
                        vm.selectedItemPassation_marches.notification_intention   = passation_marches.notification_intention;
                        vm.selectedItemPassation_marches.date_notification_attribution  = passation_marches.date_notification_attribution ;
                        
                        vm.selectedItemPassation_marches.$selected  = false;
                        vm.selectedItemPassation_marches.$edit      = false;
                        vm.selectedItemPassation_marches ={};
                        vm.showbuttonNouvPassation= false;*/
                    }
                    else 
                    {    
                      vm.allpassation_marches = vm.allpassation_marches.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPassation_marches.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                 /* passation_marches.observation   = passation_marches.observation ;
                  passation_marches.date_os   = passation_marches.date_os ;
                  passation_marches.date_remise   = passation_marches.date_remise ;
                  passation_marches.date_ano_dpfi = passation_marches.date_ano_dpfi ;
                  passation_marches.nbr_offre_recu = passation_marches.nbr_offre_recu;
                  passation_marches.date_lancement = passation_marches.date_lancement ;
                  passation_marches.montant_moin_chere = passation_marches.montant_moin_chere ;
                  passation_marches.date_demande_ano_dpfi    = passation_marches.date_demande_ano_dpfi ;
                  passation_marches.date_rapport_evaluation  = passation_marches.date_rapport_evaluation ;
                  passation_marches.notification_intention   = passation_marches.notification_intention;
                  passation_marches.date_notification_attribution  = passation_marches.date_notification_attribution ;*/

                  passation_marches.id  =   String(data.response);              
                  NouvelItemPassation_marches=false;
                  vm.showbuttonNouvPassation= false;
            }
              passation_marches.$selected = false;
              passation_marches.$edit = false;
              vm.selectedItemPassation_marches = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches****************************************/

/**********************************fin mpe_sousmissionnaire****************************************/

//col table
        vm.mpe_soumissionaire_column = [
        {titre:"MPE sousmissionnaire"
        },
        {titre:"Telephone"
        },
        {titre:"Siège"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterMpe_soumissionaire = function ()
        { 
          if (NouvelItemMpe_soumissionaire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_prestataire: '',
              telephone: '',
              siege: ''
            };         
            vm.allmpe_soumissionaire.push(items);
            vm.allmpe_soumissionaire.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemMpe_soumissionaire = mem;
              }
            });

            NouvelItemMpe_soumissionaire = true ;
          }else
          {
            vm.showAlert('Ajout mpe_soumissionaire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMpe_soumissionaire(mpe_soumissionaire,suppression)
        {
            if (NouvelItemMpe_soumissionaire==false)
            {
                test_existanceMpe_soumissionaire (mpe_soumissionaire,suppression); 
            } 
            else
            {
                insert_in_baseMpe_soumissionaire(mpe_soumissionaire,suppression);
            }
        }

        //fonction de bouton d'annulation mpe_soumissionaire
        vm.annulerMpe_soumissionaire = function(item)
        {
          if (NouvelItemMpe_soumissionaire == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_prestataire   = currentItemMpe_soumissionaire.id_prestataire ;
            item.telephone   = currentItemMpe_soumissionaire.telephone ;
            item.siege   = currentItemMpe_soumissionaire.siege ;
          }else
          {
            vm.allmpe_soumissionaire = vm.allmpe_soumissionaire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMpe_soumissionaire.id;
            });
          }

          vm.selectedItemMpe_soumissionaire = {} ;
          NouvelItemMpe_soumissionaire      = false;
          
        };

        //fonction selection item region
        vm.selectionMpe_soumissionaire= function (item)
        {
            vm.selectedItemMpe_soumissionaire = item;
            vm.nouvelItemMpe_soumissionaire   = item;
            currentItemMpe_soumissionaire    = JSON.parse(JSON.stringify(vm.selectedItemMpe_soumissionaire)); 
        };
        $scope.$watch('vm.selectedItemMpe_soumissionaire', function()
        {
             if (!vm.allmpe_soumissionaire) return;
             vm.allmpe_soumissionaire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMpe_soumissionaire.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierMpe_soumissionaire = function(item)
        {
            NouvelItemMpe_soumissionaire = false ;
            vm.selectedItemMpe_soumissionaire = item;
            currentItemMpe_soumissionaire = angular.copy(vm.selectedItemMpe_soumissionaire);
            $scope.vm.allmpe_soumissionaire.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_prestataire   = vm.selectedItemMpe_soumissionaire.id_prestataire ;
            item.telephone   = vm.selectedItemMpe_soumissionaire.telephone ;
            item.siege   = vm.selectedItemMpe_soumissionaire.siege ;
        };

        //fonction bouton suppression item Mpe_soumissionaire
        vm.supprimerMpe_soumissionaire = function()
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
                vm.ajoutMpe_soumissionaire(vm.selectedItemMpe_soumissionaire,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceMpe_soumissionaire (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmpe_soumissionaire.filter(function(obj)
                {
                   return obj.id == currentItemMpe_soumissionaire.id;
                });
                if(pass[0])
                {
                   if((pass[0].id_prestataire   != currentItemMpe_soumissionaire.id_prestataire ))                   
                      { 
                         insert_in_baseMpe_soumissionaire(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMpe_soumissionaire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseMpe_soumissionaire(mpe_soumissionaire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMpe_soumissionaire==false)
            {
                getId = vm.selectedItemMpe_soumissionaire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_prestataire: mpe_soumissionaire.id_prestataire,
                    id_passation_marches: vm.selectedItemPassation_marches.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("mpe_soumissionaire/index",datas, config).success(function (data)
            {   var nb_offre = 0;
                var press= vm.allprestataire.filter(function(obj)
                {
                    return obj.id == mpe_soumissionaire.id_prestataire;
                });

                if (NouvelItemMpe_soumissionaire == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemMpe_soumissionaire.prestataire = press[0];
                        
                        vm.selectedItemMpe_soumissionaire.$selected  = false;
                        vm.selectedItemMpe_soumissionaire.$edit      = false;
                        vm.selectedItemMpe_soumissionaire ={};
                    }
                    else 
                    {    
                      vm.allmpe_soumissionaire = vm.allmpe_soumissionaire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMpe_soumissionaire.id;
                      });
                      nb_offre= parseInt(vm.selectedItemPassation_marches.nbr_offre_recu) - 1;
                      //miseajourPassation_marches(vm.selectedItemPassation_marches,0,nb_offre);
                    }
                }
                else
                {
                  mpe_soumissionaire.prestataire = press[0]; ; 

                  mpe_soumissionaire.id  =   String(data.response);              
                  NouvelItemMpe_soumissionaire=false;

                  nb_offre= parseInt(vm.selectedItemPassation_marches.nbr_offre_recu) + 1;
                  //miseajourPassation_marches(vm.selectedItemPassation_marches,0,nb_offre);
            }
             vm.selectedItemPassation_marches.nbr_offre_recu = nb_offre
              mpe_soumissionaire.$selected = false;
              mpe_soumissionaire.$edit = false;
              vm.selectedItemMpe_soumissionaire = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changePrestataire = function(item)
        {
          var pre = vm.allprestataire.filter(function(obj)
          {
              return obj.id == item.id_prestataire;
          });
         // console.log(pre[0]);
          item.telephone=pre[0].telephone;
          item.siege=pre[0].siege;
        }

         //insertion ou mise a jours ou suppression item dans bdd feffi
       /* function miseajourPassation_marches(passation_marches,suppression,nbr_offre_recu)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
          
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        vm.selectedItemPassation_marches.id,
                    date_lancement: convertionDate(new Date(passation_marches.date_lancement)),
                    date_os: convertionDate(new Date(passation_marches.date_os)),
                    date_remise: convertionDate(new Date(passation_marches.date_remise)),
                    nbr_offre_recu: nbr_offre_recu,
                    montant_moin_chere:passation_marches.montant_moin_chere,
                    date_rapport_evaluation:convertionDate(new Date(passation_marches.date_rapport_evaluation)),
                    date_demande_ano_dpfi: convertionDate(new Date(passation_marches.date_demande_ano_dpfi)),
                    date_ano_dpfi: convertionDate(new Date(passation_marches.date_ano_dpfi)),
                    notification_intention: convertionDate(new Date(passation_marches.notification_intention)),
                    date_notification_attribution: convertionDate(new Date(passation_marches.date_notification_attribution)),
                    date_signature_contrat: convertionDate(new Date(passation_marches.date_signature_contrat)),
                    id_prestataire: passation_marches.prestataire.id,
                    observation:passation_marches.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id               
                });
                //factory
            apiFactory.add("passation_marches/index",datas, config).success(function (data)
            {
              vm.selectedItemPassation_marches.nbr_offre_recu = nbr_offre_recu;
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }*/
/**********************************fin mpe_sousmissionnaire****************************************/
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
