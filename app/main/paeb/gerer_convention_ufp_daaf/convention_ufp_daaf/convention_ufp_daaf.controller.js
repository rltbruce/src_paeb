(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.convention_ufp_daaf')
        .controller('Convention_ufp_daafController', Convention_ufp_daafController)
        .controller('ConventionDialogController', ConventionDialogController);
    /** @ngInject */
    function Convention_ufp_daafController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService)
    {
		    var vm = this;

    //initialisation convetion ufp/daaf entete 
        vm.ajoutConvention_ufp_daaf_entete = ajoutConvention_ufp_daaf_entete ;
        var NouvelItemConvention_ufp_daaf_entete = false;
        var currentItemConvention_ufp_daaf_entete;
        vm.selectedItemConvention_ufp_daaf_entete = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.afficherboutonValider = false;
        vm.permissionboutonValider = false;
        

      //initialisation convetion ufp/daaf detail  
        vm.ajoutConvention_ufp_daaf_detail = ajoutConvention_ufp_daaf_detail ;
        var NouvelItemConvention_ufp_daaf_detail = false;
        var currentItemConvention_ufp_daaf_detail;
        vm.selectedItemConvention_ufp_daaf_detail = {} ;
        vm.allconvention_ufp_daaf_detail  = [] ; 
        vm.showbuttonNouvDetail = true;
        vm.allcompte_daaf  = [] ; 

    //initialisation convention
        vm.selectedItemConvention_cisco_feffi_entete = {} ;
        var currentItemConvention_cisco_feffi_entete;
        var NouvelItemConvention_cisco_feffi_entete = false;
        vm.allconvention_cisco_feffi_entete = [] ;

        vm.date_now = new Date();     

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

        //style
        vm.dtOptionsperso2 = {
          dom: '<"top"><"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };

         var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
            //var roles = result.data.response.roles;

            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'DAAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }

        });
/*****************Debut StepOne convention_ufp_daaf_entete****************/

  //col table
        vm.convention_ufp_daaf_entete_column = [        
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Montant convention"},
        {titre:"Action"}];

  //recuperation donnée programmation
        apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getconvention_ufp_daaf_validation","validation",0).then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
        });

   //recuperation donnée programmation
        apiFactory.getAll("compte_daaf/index").then(function(result)
        {
            vm.allcompte_daaf = result.data.response;
            ////console.log(vm.allcompte_daaf);
        });

       

      //Masque de saisi ajout
        vm.ajouterConvention_ufp_daaf_entete = function ()
        { 
          if (NouvelItemConvention_ufp_daaf_entete == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              ref_convention: '',
              objet: '',
              ref_financement: '',
              montant_convention: 0,                            
              montant_trans_comm: 0,
              frais_bancaire: 0
            };         
            vm.allconvention_ufp_daaf_entete.push(items);
            vm.allconvention_ufp_daaf_entete.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemConvention_ufp_daaf_entete = conv;
              }
            });

            NouvelItemConvention_ufp_daaf_entete = true ;
          }else
          {
            vm.showAlert('Ajout convention_ufp_daaf_entete','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutConvention_ufp_daaf_entete(convention_ufp_daaf_entete,suppression,validation)
        {
            if (NouvelItemConvention_ufp_daaf_entete==false)
            {
                test_existanceConvention_ufp_daaf_entete (convention_ufp_daaf_entete,suppression,validation); 
            } 
            else
            {
                insert_in_baseConvention_ufp_daaf_entete(convention_ufp_daaf_entete,suppression,validation);
            }
        }

        //fonction de bouton d'annulation convention_ufp_daaf_entete
        vm.annulerConvention_ufp_daaf_entete = function(item)
        {
          if (NouvelItemConvention_ufp_daaf_entete == false)
          {
            item.$edit = false;
            item.$selected = false;

            item.objet = currentItemConvention_ufp_daaf_entete.objet;            
            item.ref_convention = currentItemConvention_ufp_daaf_entete.ref_convention ;
            item.ref_financement = currentItemConvention_ufp_daaf_entete.ref_financement ;
            item.montant_convention = currentItemConvention_ufp_daaf_entete.montant_convention ; 
            item.montant_trans_comm = currentItemConvention_ufp_daaf_entete.montant_trans_comm ;
            item.frais_bancaire = currentItemConvention_ufp_daaf_entete.frais_bancaire ; 
          }
          else
          {
            vm.allconvention_ufp_daaf_entete = vm.allconvention_ufp_daaf_entete.filter(function(obj)
            {
                return obj.id !== vm.selectedItemConvention_ufp_daaf_entete.id;
            });
          }
          NouvelItemConvention_ufp_daaf_entete      = false;
          vm.selectedItemConvention_ufp_daaf_entete = {} ;
          
        };

        //fonction selection item region
        vm.selectionConvention_ufp_daaf_entete= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;
            currentItemConvention_ufp_daaf_entete     = JSON.parse(JSON.stringify(vm.selectedItemConvention_ufp_daaf_entete));
           // vm.allconvention_ufp_daaf_entete= [] ;
            
           if (vm.selectedItemConvention_ufp_daaf_entete.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_ufp_daaf_detail = result.data.response;
                  if (vm.allconvention_ufp_daaf_detail.length>0)
                  {
                    vm.showbuttonNouvDetail = false;
                  } 
                  ////console.log(result.data.response);                 
              });

              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi_entete = result.data.response;                 
              });

              vm.stepOne           = true;
              vm.stepTwo           = false;
              vm.stepThree         = false;
              vm.afficherboutonValider = true;
              
           }
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_entete', function()
        {
            if (!vm.allconvention_ufp_daaf_entete) return;
            vm.allconvention_ufp_daaf_entete.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_ufp_daaf_entete.$selected = true;
        });

        //fonction masque de saisie modification item convention_ufp_daaf_entete
        vm.modifierConvention_ufp_daaf_entete = function(item)
        {
            NouvelItemConvention_ufp_daaf_entete = false ;
            vm.selectedItemConvention_ufp_daaf_entete = item;
            currentItemConvention_ufp_daaf_entete = angular.copy(vm.selectedItemItemConvention_ufp_daaf_entete);
            $scope.vm.allconvention_ufp_daaf_entete.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.objet = vm.selectedItemConvention_ufp_daaf_entete.objet ;            
            item.ref_convention = vm.selectedItemConvention_ufp_daaf_entete.ref_convention ;
            item.ref_financement = vm.selectedItemConvention_ufp_daaf_entete.ref_financement ;
            item.montant_convention = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_convention) ; 
            item.montant_trans_comm = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) ;
            item.frais_bancaire = parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire) ;
            vm.afficherboutonValider = false; 
        };

        //fonction bouton suppression item convention_ufp_daaf_entete
        vm.supprimerConvention_ufp_daaf_entete = function()
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
                vm.ajoutConvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_ufp_daaf_entete
        function test_existanceConvention_ufp_daaf_entete (item,suppression,validation)
        {          
            if (suppression!=1)
            {
               var conv = vm.allconvention_ufp_daaf_entete.filter(function(obj)
                {
                   return obj.id == currentItemConvention_ufp_daaf_entete.id;
                });
                if(conv[0])
                {
                   if((conv[0].objet!=currentItemConvention_ufp_daaf_entete.objet)
                    || (conv[0].ref_convention!=currentItemConvention_ufp_daaf_entete.ref_convention)
                    || (conv[0].montant_convention!=currentItemConvention_ufp_daaf_entete.montant_convention)
                    || (conv[0].ref_financement!=currentItemConvention_ufp_daaf_entete.ref_financement)
                    || (conv[0].montant_trans_comm!=currentItemConvention_ufp_daaf_entete.montant_trans_comm)
                    || (conv[0].frais_bancaire!=currentItemConvention_ufp_daaf_entete.frais_bancaire))                    
                      { 
                        insert_in_baseConvention_ufp_daaf_entete(item,suppression,validation);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseConvention_ufp_daaf_entete(item,suppression,validation);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function insert_in_baseConvention_ufp_daaf_entete(convention_ufp_daaf_entete,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_ufp_daaf_entete==false)
            {
                getId = vm.selectedItemConvention_ufp_daaf_entete.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet:   convention_ufp_daaf_entete.objet,
                    ref_convention: convention_ufp_daaf_entete.ref_convention,
                    montant_convention: convention_ufp_daaf_entete.montant_convention,
                    ref_financement: convention_ufp_daaf_entete.ref_financement,
                    montant_trans_comm: convention_ufp_daaf_entete.montant_trans_comm,
                    frais_bancaire: convention_ufp_daaf_entete.frais_bancaire,
                    validation: validation               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_ufp_daaf_entete/index",datas, config).success(function (data)
            {
               
                if (NouvelItemConvention_ufp_daaf_entete == false)
                {
                    // Upref_financement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemConvention_ufp_daaf_entete.$selected = false;
                        vm.selectedItemConvention_ufp_daaf_entete.$edit     = false;
                        vm.selectedItemConvention_ufp_daaf_entete ={};
                    }
                    else 
                    {    
                      vm.allconvention_ufp_daaf_entete = vm.allconvention_ufp_daaf_entete.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemConvention_ufp_daaf_entete.id;
                      });
                      
                    }
                }
                else
                {
                  convention_ufp_daaf_entete.id = String(data.response);              
                  NouvelItemConvention_ufp_daaf_entete = false;

            }
              convention_ufp_daaf_entete.$selected = false;
              convention_ufp_daaf_entete.$edit = false;
              vm.selectedItemConvention_ufp_daaf_entete = {};
              vm.afficherboutonValider = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.changefraisbancaire = function(item)
        {
          item.montant_convention = parseInt(item.montant_trans_comm) + parseInt(item.frais_bancaire);
        }
        vm.validerConvention = function()
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemConvention_ufp_daaf_entete.id,
                    objet:   vm.selectedItemConvention_ufp_daaf_entete.objet,
                    ref_convention: vm.selectedItemConvention_ufp_daaf_entete.ref_convention,
                    montant_convention: vm.selectedItemConvention_ufp_daaf_entete.montant_convention,
                    ref_financement: vm.selectedItemConvention_ufp_daaf_entete.ref_financement,
                    montant_trans_comm: vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm,
                    frais_bancaire: vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire,
                    validation: 1               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_ufp_daaf_entete/index",datas, config).success(function (data)
            {   
              vm.allconvention_ufp_daaf_entete = vm.allconvention_ufp_daaf_entete.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemConvention_ufp_daaf_entete.id;
              });
              vm.afficherboutonValider = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de validation de donnée');});
        }

  /*****************Fin StepOne convention_ufp_daaf_entete****************/

  /*****************Debut StepOne convention_ufp_daaf_detail****************/

  //col table
        vm.convention_ufp_daaf_detail_column = [        
        {titre:"Nom banque"},
        {titre:"Adresse banque"},        
        {titre:"RIB"},
        {titre:"Delai"},
        {titre:"Date signature"},        
        {titre:"Observation"},
        {titre:"Action"}];

  //recuperation donnée programmation
        apiFactory.getAll("convention_ufp_daaf_detail/index").then(function(result)
        {
            vm.allconvention_ufp_daaf_detail = result.data.response;
        });

      //Masque de saisi ajout
        vm.ajouterConvention_ufp_daaf_detail = function ()
        { 
          if (NouvelItemConvention_ufp_daaf_detail == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_compte_daaf:'',
              adresse_banque:'',
              rib:'',
              delai:'',
              date_signature:'',
              observation:''
            };         
            vm.allconvention_ufp_daaf_detail.push(items);
            vm.allconvention_ufp_daaf_detail.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemConvention_ufp_daaf_detail = conv;
              }
            });

            NouvelItemConvention_ufp_daaf_detail = true ;
          }else
          {
            vm.showAlert('Ajout convention_ufp_daaf_detail','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutConvention_ufp_daaf_detail(convention_ufp_daaf_detail,suppression,validation)
        {
            if (NouvelItemConvention_ufp_daaf_detail==false)
            {
                test_existanceConvention_ufp_daaf_detail (convention_ufp_daaf_detail,suppression,validation); 
            } 
            else
            {
                insert_in_baseConvention_ufp_daaf_detail(convention_ufp_daaf_detail,suppression,validation);
            }
        }

        //fonction de bouton d'annulation convention_ufp_daaf_detail
        vm.annulerConvention_ufp_daaf_detail = function(item)
        {
          if (NouvelItemConvention_ufp_daaf_detail == false)
          {
            item.$edit = false;
            item.$selected = false;

            item.id_compte_daaf  = currentItemConvention_ufp_daaf_detail.compte_daaf.id ;
            item.nom_banque  = currentItemConvention_ufp_daaf_detail.compte_daaf.nom_banque ;
            item.adresse_banque  = currentItemConvention_ufp_daaf_detail.compte_daaf.adresse_banque ;
            item.rib  = currentItemConvention_ufp_daaf_detail.compte_daaf.rib ;
            item.delai = currentItemConvention_ufp_daaf_detail.delai ;
            item.observation  = currentItemConvention_ufp_daaf_detail.observation ;
            item.date_signature  = new Date(currentItemConvention_ufp_daaf_detail.date_signature) ;  
          }
          else
          {
            vm.allconvention_ufp_daaf_detail = vm.allconvention_ufp_daaf_detail.filter(function(obj)
            {
                return obj.id !== vm.selectedItemConvention_ufp_daaf_detail.id;
            });
          }
          NouvelItemConvention_ufp_daaf_detail      = false;
          vm.selectedItemConvention_ufp_daaf_detail = {} ;
          
        };

        //fonction selection item region
        vm.selectionConvention_ufp_daaf_detail= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_detail = item;
            if (item.$selected==false)
            {
              currentItemConvention_ufp_daaf_detail     = JSON.parse(JSON.stringify(vm.selectedItemConvention_ufp_daaf_detail));
           
            }
            
            vm.stepTwo = false;
            vm.stepThree = false;
           if (vm.selectedItemConvention_ufp_daaf_detail.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_detail.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi = result.data.response;                  
              });
           }
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_detail', function()
        {
            if (!vm.allconvention_ufp_daaf_detail) return;
            vm.allconvention_ufp_daaf_detail.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_ufp_daaf_detail.$selected = true;
        });

        //fonction masque de saisie modification item convention_ufp_daaf_detail
        vm.modifierConvention_ufp_daaf_detail = function(item)
        {
            NouvelItemConvention_ufp_daaf_detail = false ;
            vm.selectedItemConvention_ufp_daaf_detail = item;
            currentItemConvention_ufp_daaf_detail = angular.copy(vm.selectedItemConvention_ufp_daaf_detail);
            $scope.vm.allconvention_ufp_daaf_detail.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.id_compte_daaf  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.id ;
            item.nom_banque  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.nom_banque ;
            item.adresse_banque  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.adresse_banque ;
            item.rib  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.rib ;
            item.delai = parseInt(vm.selectedItemConvention_ufp_daaf_detail.delai) ;
            item.observation  = vm.selectedItemConvention_ufp_daaf_detail.observation ;
            item.date_signature  = new Date(vm.selectedItemConvention_ufp_daaf_detail.date_signature) 
        };

        //fonction bouton suppression item convention_ufp_daaf_detail
        vm.supprimerConvention_ufp_daaf_detail = function()
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
                vm.ajoutConvention_ufp_daaf_detail(vm.selectedItemConvention_ufp_daaf_detail,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_ufp_daaf_detail
        function test_existanceConvention_ufp_daaf_detail (item,suppression,validation)
        {   //console.log(currentItemConvention_ufp_daaf_detail);       
            if (suppression!=1)
            {
               var convD = vm.allconvention_ufp_daaf_detail.filter(function(obj)
                {
                   return obj.id == currentItemConvention_ufp_daaf_detail.id;
                });
                if(convD[0])
                {
                   if( (convD[0].intitule!=currentItemConvention_ufp_daaf_detail.intitule)
                    || (convD[0].date_signature!=currentItemConvention_ufp_daaf_detail.date_signature)
                    || (convD[0].id_compte_daaf!=currentItemConvention_ufp_daaf_detail.id_compte_daaf)
                    || (convD[0].observation!=currentItemConvention_ufp_daaf_detail.observation)
                    || (convD[0].delai!=currentItemConvention_ufp_daaf_detail.delai))                    
                      { 
                        insert_in_baseConvention_ufp_daaf_detail(item,suppression,validation);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseConvention_ufp_daaf_detail(item,suppression,validation);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_detail
        function insert_in_baseConvention_ufp_daaf_detail(convention_ufp_daaf_detail,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_ufp_daaf_detail==false)
            {
                getId = vm.selectedItemConvention_ufp_daaf_detail.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    delai:    convention_ufp_daaf_detail.delai,
                    date_signature:    convertionDate(new Date(convention_ufp_daaf_detail.date_signature)),
                    id_compte_daaf: convention_ufp_daaf_detail.id_compte_daaf,
                    observation: convention_ufp_daaf_detail.observation,
                    id_convention_ufp_daaf_entete: vm.selectedItemConvention_ufp_daaf_entete.id               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_ufp_daaf_detail/index",datas, config).success(function (data)
            {
               var compte = vm.allcompte_daaf.filter(function(obj)
                {
                   return obj.id == convention_ufp_daaf_detail.id_compte_daaf;
                });
                if (NouvelItemConvention_ufp_daaf_detail == false)
                {
                    // Upref_financement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemConvention_ufp_daaf_detail.compte_daaf = compte[0];
                        vm.selectedItemConvention_ufp_daaf_detail.$selected = false;
                        vm.selectedItemConvention_ufp_daaf_detail.$edit     = false;
                        vm.selectedItemConvention_ufp_daaf_detail ={};
                    }
                    else 
                    {    
                      vm.allconvention_ufp_daaf_detail = vm.allconvention_ufp_daaf_detail.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemConvention_ufp_daaf_detail.id;
                      });
                      vm.showbuttonNouvDetail = true;
                    }
                }
                else
                {
                  convention_ufp_daaf_detail.compte_daaf = compte[0];
                  convention_ufp_daaf_detail.id = String(data.response);              
                  NouvelItemConvention_ufp_daaf_detail = false;
                  vm.showbuttonNouvDetail = false;
            }
              convention_ufp_daaf_detail.$selected = false;
              convention_ufp_daaf_detail.$edit = false;
              vm.selectedItemConvention_ufp_daaf_detail = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changecompte_daaf = function(item)
        { var compte = vm.allcompte_daaf.filter(function(obj)
          {
            return obj.id == item.id_compte_daaf;
          });
          item.adresse_banque = compte[0].adresse_banque;
          item.rib = compte[0].rib;
        }

  /*****************Fin StepOne convention_ufp_daaf_detail****************/


  /*****************Debut StepTwo convention***************/

        //col table
        vm.convention_cisco_feffi_entete_column = [
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
        },
        {titre:"Action"
        }];
        
        

        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;
            currentItemConvention_cisco_feffi_entete     = JSON.parse(JSON.stringify(vm.selectedItemConvention_cisco_feffi_entete));
           // vm.allconvention= [] ;
           vm.stepOne = true;
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
             if (!vm.allconvention_cisco_feffi_entete) return;
             vm.allconvention_cisco_feffi_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi_entete.$selected = true;

        });

        //fonction bouton suppression de l'item convention_cisco_feefi
        vm.supprimerConvention_cisco_feffi_entete = function()
        {
            var confirm = $mdDialog.confirm()
                    .title("Etes-vous sûr d'enlever cet enregistrement ?")
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                insert_in_base_convention_cisco_feffi_entete(vm.selectedItemConvention_cisco_feffi_entete,0,1);
     
              }, function() {
                //alert('rien');
              });
        };

        vm.ajoutConventionDialog = function (ev)
        {
          NouvelItemConvention_cisco_feffi_entete = true;
          var confirm = $mdDialog.confirm({
          controller: ConventionDialogController,
          templateUrl: 'app/main/paeb/gerer_convention_ufp_daaf/convention_ufp_daaf/conventiondialog.html',
          parent: angular.element(document.body),
          targetEvent: ev, 
          
          })

              $mdDialog.show(confirm).then(function(data)
              {
               
               insert_in_base_convention_cisco_feffi_entete(data,'0',0);

               //recuperation donnée convention detail
               /* apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',data.id).then(function(result)
                {
                    var convention_cife_detail_entete = result.data.response;
                    ////console.log(convention_cife_detail[0]);
                   // var montant = parseInt(vm.selectedItemConvention_ufp_daaf_entete.ref_convention) + parseInt(convention_cife_detail_entete[0].montant_total);
                    //miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,'0',montant);
                });*/
             
              }, function(){//alert('rien');
            });

        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi
        function insert_in_base_convention_cisco_feffi_entete(convention_cisco_feffi_entete,suppression,enlever)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            console.log(convention_cisco_feffi_entete);
            //var validation = 1;
            var datas = $.param({
                    supprimer: suppression,
                    id:        convention_cisco_feffi_entete.id,      
                    id_cisco: convention_cisco_feffi_entete.cisco.id,
                    id_feffi: convention_cisco_feffi_entete.feffi.id,
                    objet:    convention_cisco_feffi_entete.objet,
                    ref_financement:  convention_cisco_feffi_entete.ref_financement,
                    ref_convention:   convention_cisco_feffi_entete.ref_convention,
                    montant_total:    convention_cisco_feffi_entete.montant_total,
                    avancement:    convention_cisco_feffi_entete.avancement,
                    id_convention_ufpdaaf: vm.selectedItemConvention_ufp_daaf_entete.id,
                    validation: 2               
                });

            if (enlever==1)
            {
                datas = $.param({
                    supprimer: suppression,
                    id:        convention_cisco_feffi_entete.id,      
                    id_cisco: convention_cisco_feffi_entete.cisco.id,
                    id_feffi: convention_cisco_feffi_entete.feffi.id,
                    objet:    convention_cisco_feffi_entete.objet,
                    ref_financement:  convention_cisco_feffi_entete.ref_financement,
                    ref_convention:   convention_cisco_feffi_entete.ref_convention,
                    montant_total:    convention_cisco_feffi_entete.montant_total,
                    avancement:    convention_cisco_feffi_entete.avancement,
                    validation: 1               
                });
            }
            
            console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            {   

              if (NouvelItemConvention_cisco_feffi_entete== false)
                { 
                  vm.allconvention_cisco_feffi_entete = vm.allconvention_cisco_feffi_entete.filter(function(obj)
                  {
                      return obj.id !== vm.selectedItemConvention_cisco_feffi_entete.id;
                  });
                  var montant_trans = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) - parseInt(convention_cisco_feffi_entete.montant_total);
                  var montant_conv = montant_trans + parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire)
                  miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,montant_trans,montant_conv);
                  
                }else
                {
                  vm.allconvention_cisco_feffi_entete.push(convention_cisco_feffi_entete);
                  NouvelItemConvention_cisco_feffi_entete= false;
                  var montant_trans = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) + parseInt(convention_cisco_feffi_entete.montant_total);
                  var montant_conv = montant_trans + parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire)
                  miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,montant_trans,montant_conv);
                    
                }
                
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        } 

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function miseajourconvention_ufp_daaf_entete(convention_ufp_daaf_entete,montant_trans, montant_conv)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_ufp_daaf_entete==false)
            {
                getId = vm.selectedItemConvention_ufp_daaf_entete.id; 
            } 
            
            var datas = $.param({
                    supprimer: '0',
                    id:        convention_ufp_daaf_entete.id,
                    objet:   convention_ufp_daaf_entete.objet,
                    ref_convention: convention_ufp_daaf_entete.ref_convention,
                    montant_convention: montant_conv,
                    ref_financement: convention_ufp_daaf_entete.ref_financement,
                    montant_trans_comm: montant_trans,
                    frais_bancaire: convention_ufp_daaf_entete.frais_bancaire,
                    validation: 0               
                });
                //factory
            apiFactory.add("convention_ufp_daaf_entete/index",datas, config).success(function (data)
            {
               
                vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm = montant_trans;  
                vm.selectedItemConvention_ufp_daaf_entete.montant_convention = montant_conv;            
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }             

  /*****************Fin StepTwo convention****************/        

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

        //convertion date au format AAAA-MM-JJ
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


/*****************Debut ConventionDialogue Controlleur  ****************/    
    function ConventionDialogController($mdDialog, $scope, apiFactory, $state)
    { 
        var dg=$scope;
        dg.affichebuttonAjouter = false;
        dg.selectedItemConventionDialog = {};
        var currentItemConventionDialog;
        var nouvelItemConventionDialog = false;
        dg.allconventionDialog = [];

        dg.conventiondialog_column = [
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

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventioninvalidedaaf').then(function(result)
        {dg.allconventionDialog = result.data.response;});

        dg.cancel = function()
        {
          $mdDialog.cancel();
          dg.affichebuttonAjouter = false;
        };

        dg.dialognouveauajout = function(conven)
        {  
            $mdDialog.hide(dg.selectedItemConventionDialog);
            dg.affichebuttonAjouter = false;
        }

        //format date affichage sur datatable
        dg.formatDate = function (daty)
        {
            if (daty) 
            {
                var date  = new Date(daty);
                var mois  = date.getMonth()+1;
                var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
                return dates;
            }           

        }

        //fonction selection item convetion
        dg.selectionConventionDialog = function (item)
        {
            dg.selectedItemConventionDialog  = item;
            dg.affichebuttonAjouter = true;               
        };
        
        $scope.$watch('selectedItemConventionDialog', function()
        {
            if (!dg.allconventionDialog) return;
              dg.allconventionDialog.forEach(function(iteme)
              {
                  iteme.$selected = false;
              });
            dg.selectedItemConventionDialog.$selected = true;
        });

    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
