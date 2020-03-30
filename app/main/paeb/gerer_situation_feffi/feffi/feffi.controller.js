(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.feffi')
        .controller('FeffiController', FeffiController);
    /** @ngInject */
    function FeffiController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allfeffi = [] ;

        vm.ajoutMembre = ajoutMembre ;
        var NouvelItemMembre=false;
        var currentItemMembre;
        vm.selectedItemMembre = {} ;
        vm.allmembre = [] ;

        vm.ajoutCompte_feffi = ajoutCompte_feffi ;
        var NouvelItemCompte_feffi=false;
        var currentItemCompte_feffi;
        vm.selectedItemCompte_feffi = {} ;
        vm.allcompte_feffi = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

/**********************************debut feffi****************************************/

        //col table
        vm.feffi_column = [
          {titre:"Identifiant"},
          {titre:"Dénomination"},
          {titre:"Nombre feminin"},
          {titre:"Nombre membre"},
          {titre:"Adresse"},
          {titre:"Ecole"},
          {titre:"Observation"},
          {titre:"Action"}];
        
        
          var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          //vm.allcisco.push(usercisco);
          
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allfeffi = result.data.response; 
                console.log(vm.allfeffi);
            });

            apiFactory.getAPIgeneraliserREST("ecole/index",'menus','getecoleBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allecole = result.data.response; 
                console.log(vm.allecole);
            });
          }
          

        });

        //recuperation donnée feffi
        /*apiFactory.getAll("feffi/index").then(function(result)
        {
            vm.allfeffi = result.data.response; 
            console.log(vm.allfeffi);
        });

        //recuperation donnée cisco
        apiFactory.getAll("ecole/index").then(function(result)
        {
          vm.allecole= result.data.response;
        });*/

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              identifiant: '',
              denomination: '',
              nbr_feminin: 0,
              nbr_membre: 0,
              adresse: '',
              observation: '',
              id_ecole: ''
            };         
            vm.allfeffi.push(items);
            vm.allfeffi.forEach(function(asso)
            {
              if(asso.$selected==true)
              {
                vm.selectedItem = asso;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(feffi,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (feffi,suppression); 
            } 
            else
            {
                insert_in_base(feffi,suppression);
            }
        }

        //fonction de bouton d'annulation feffi
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.identifiant      = currentItem.identifiant ;
            item.denomination      = currentItem.denomination ;
            item.nbr_feminin      = currentItem.nbr_feminin ;
            item.nbr_membre      = currentItem.nbr_membre ;
            item.adresse      = currentItem.adresse ;
            item.observation      = currentItem.observation ;
            item.id_ecole      = currentItem.id_ecole; 
          }else
          {
            vm.allfeffi = vm.allfeffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            if(item.$selected==false)
            {
              currentItem     = JSON.parse(JSON.stringify(vm.selectedItem)); 
            }
            if (vm.selectedItem.id!=0)
            {
              //recuperation donnée membre
              apiFactory.getAPIgeneraliserREST("membre_feffi/index",'id_feffi',vm.selectedItem.id).then(function(result)
              {
                  vm.allmembre = result.data.response; 
                  console.log( vm.allmembre);
              });

              //recuperation donnée compte
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',vm.selectedItem.id).then(function(result)
              {
                  vm.allcompte_feffi = result.data.response; 
                  console.log(vm.allcompte_feffi);
              });
              vm.stepOne = true;
            }
            
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allfeffi) return;
             vm.allfeffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allfeffi.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true; 

            item.identifiant      = vm.selectedItem.identifiant ;
            item.denomination      = vm.selectedItem.denomination ;
            item.nbr_feminin      = vm.selectedItem.nbr_feminin ;
            item.nbr_membre      = vm.selectedItem.nbr_membre ;
            item.adresse      = vm.selectedItem.adresse ;
            item.observation      = vm.selectedItem.observation ;
            item.id_ecole  = vm.selectedItem.ecole.id;
        };

        //fonction bouton suppression item feffi
        vm.supprimer = function()
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
                vm.ajout(vm.selectedItem,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allfeffi.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].identifiant!=currentItem.identifiant) 
                    || (cis[0].denomination!=currentItem.denomination)
                    || (cis[0].adresse!=currentItem.adresse)
                    || (cis[0].observation!=currentItem.observation)
                    || (cis[0].id_ecole!=currentItem.id_ecole))                    
                      { 
                         insert_in_base(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_base(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_base(feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    denomination:      feffi.denomination,
                    identifiant: feffi.identifiant,
                    adresse: feffi.adresse,
                    observation:      feffi.observation,
                    id_ecole: feffi.id_ecole                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("feffi/index",datas, config).success(function (data)
            {
                
                var eco = vm.allecole.filter(function(obj)
                {
                    return obj.id == feffi.id_ecole;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.ecole       = eco[0];

                        /*vm.selectedItem.identifiant      = feffi.identifiant ;
                        vm.selectedItem.denomination      = feffi.denomination ;
                        vm.selectedItem.nbr_feminin      = feffi.nbr_feminin ;
                        vm.selectedItem.nbr_membre      = feffi.nbr_membre ;
                        vm.selectedItem.adresse      = feffi.adresse ;
                        vm.selectedItem.observation      = feffi.observation ;*/
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allfeffi = vm.allfeffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {

                  /*feffi.identifiant      = feffi.identifiant ;
                  feffi.denomination      = feffi.denomination ;
                  feffi.nbr_feminin      = feffi.nbr_feminin ;
                  feffi.nbr_membre      = feffi.nbr_membre ;
                  feffi.adresse      = feffi.adresse ;
                  feffi.observation      = feffi.observation ;*/

                  feffi.ecole = eco[0];
                  feffi.id  =   String(data.response);              
                  NouvelItem=false;
            }
              feffi.$selected = false;
              feffi.$edit = false;
              vm.selectedItem = {};
              vm.stepOne = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/**********************************fin feffi****************************************/

/**********************************debut membre****************************************/
//col table
        vm.membre_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Age"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterMembre = function ()
        { 
          if (NouvelItemMembre == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              age:'',
              occupation:''
            };         
            vm.allmembre.push(items);
            vm.allmembre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemMembre = mem;
              }
            });

            NouvelItemMembre = true ;
          }else
          {
            vm.showAlert('Ajout membre','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMembre(membre,suppression)
        {
            if (NouvelItemMembre==false)
            {
                test_existanceMembre (membre,suppression); 
            } 
            else
            {
                insert_in_baseMembre(membre,suppression);
            }
        }

        //fonction de bouton d'annulation membre
        vm.annulerMembre = function(item)
        {
          if (NouvelItemMembre == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemMembre.nom ;
            item.prenom   = currentItemMembre.prenom ;
            item.sexe      = currentItemMembre.sexe;
            item.age      = currentItemMembre.age ;
            item.occupation   = currentItem.occupation ; 
          }else
          {
            vm.allmembre = vm.allmembre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMembre.id;
            });
          }

          vm.selectedItemMembre = {} ;
          NouvelItemMembre      = false;
          
        };

        //fonction selection item region
        vm.selectionMembre= function (item)
        {
            vm.selectedItemMembre = item;
            vm.nouvelItemMembre   = item;
            if(item.$selected==false)
            {
              currentItemMembre    = JSON.parse(JSON.stringify(vm.selectedItemMembre));
            } 
        };
        $scope.$watch('vm.selectedItemMembre', function()
        {
             if (!vm.allmembre) return;
             vm.allmembre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMembre.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierMembre = function(item)
        {
            NouvelItemMembre = false ;
            vm.selectedItemMembre = item;
            currentItemMembre = angular.copy(vm.selectedItemMembre);
            $scope.vm.allmembre.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemMembre.nom ;
            item.prenom = vm.selectedItemMembre.prenom;
            item.sexe  = vm.selectedItemMembre.sexe;
            item.age      =parseInt(vm.selectedItemMembre.age)  ;
            item.occupation = vm.selectedItemMembre.occupation; 
        };

        //fonction bouton suppression item membre
        vm.supprimerMembre = function()
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
                vm.ajoutMembre(vm.selectedItemMembre,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceMembre (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allmembre.filter(function(obj)
                {
                   return obj.id == currentItemMembre.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemMembre.nom) 
                    || (mem[0].prenom!=currentItemMembre.prenom)
                    || (mem[0].sexe!=currentItemMembre.sexe)
                    || (mem[0].age!=currentItemMembre.age)
                    || (mem[0].occupation!=currentItemMembre.occupation))                    
                      { 
                         insert_in_baseMembre(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMembre(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseMembre(membre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMembre==false)
            {
                getId = vm.selectedItemMembre.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      membre.nom,
                    prenom: membre.prenom,
                    sexe: membre.sexe,
                    age: membre.age,
                    occupation: membre.occupation,
                    id_feffi: vm.selectedItem.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("membre_feffi/index",datas, config).success(function (data)
            {
                if (NouvelItemMembre == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemMembre.nom        = membre.nom;
                        vm.selectedItemMembre.prenom       = membre.prenom;
                        vm.selectedItemMembre.sexe        = membre.sexe;
                        vm.selectedItemMembre.age       = membre.age;
                        vm.selectedItemMembre.occupation        = membre.occupation;
                        vm.selectedItemMembre.$selected  = false;
                        vm.selectedItemMembre.$edit      = false;
                        vm.selectedItemMembre ={};

                        if(currentItemMembre.sexe == 1 && currentItemMembre.sexe !=vm.selectedItemMembre.sexe)
                        {
                          vm.selectedItem.nbr_feminin = parseInt(vm.selectedItem.nbr_feminin)+1;                          
                        }

                        if(currentItemMembre.sexe == 2 && currentItemMembre.sexe !=vm.selectedItemMembre.sexe)
                        {
                          vm.selectedItem.nbr_feminin = parseInt(vm.selectedItem.nbr_feminin)-1;                          
                        }
                        
                    }
                    else 
                    {    
                      vm.allmembre = vm.allmembre.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMembre.id;
                      });
                      vm.selectedItem.nbr_membre = parseInt(vm.selectedItem.nbr_membre)-1;
                      
                      if(parseInt(membre.sexe) == 2)
                      {
                        vm.selectedItem.nbr_feminin = parseInt(vm.selectedItem.nbr_feminin)-1;
                      }
                    }
                }
                else
                {
                  membre.nom        = membre.nom;
                  membre.prenom       = membre.prenom;
                  membre.sexe        = membre.sexe;
                  membre.age       = membre.age;
                  membre.occupation        = membre.occupation;
                  membre.id  =   String(data.response);              
                  NouvelItemMembre=false;

                  vm.selectedItem.nbr_membre = parseInt(vm.selectedItem.nbr_membre)+1;
                  if(parseInt(membre.sexe) == 2)
                  {
                    vm.selectedItem.nbr_feminin = parseInt(vm.selectedItem.nbr_feminin)+1;
                  }
            }
              membre.$selected = false;
              membre.$edit = false;
              vm.selectedItemMembre = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        /**********************************debut compte****************************************/
//col table
        vm.compte_feffi_column = [
        {titre:"Nom banque"},
        {titre:"Adresse banque"},
        {titre:"RIB"},
        {titre:"Numero compte"},
        {titre:"Titulaire"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterCompte_feffi = function ()
        { 
          if (NouvelItemCompte_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom_banque: '',
              adresse_banque: '',
              rib: '',
              numero_compte:'',
              id_membre_feffi:''
            };         
            vm.allcompte_feffi.push(items);
            vm.allcompte_feffi.forEach(function(comp)
            {
              if(comp.$selected==true)
              {
                vm.selectedItemCompte_feffi = comp;
              }
            });

            NouvelItemCompte_feffi = true ;
          }else
          {
            vm.showAlert('Ajout compte feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutCompte_feffi(compte_feffi,suppression)
        {
            if (NouvelItemCompte_feffi==false)
            {
                test_existanceCompte_feffi (compte_feffi,suppression); 
            } 
            else
            {
                insert_in_baseCompte_feffi(compte_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation membre
        vm.annulerCompte_feffi = function(item)
        {
          if (NouvelItemCompte_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom_banque      = currentItemCompte_feffi.nom_banque ;
            item.adresse_banque   = currentItemCompte_feffi.adresse_banque ;
            item.rib      = currentItemCompte_feffi.rib;
            item.numero_compte      = currentItemCompte_feffi.numero_compte ;
            item.id_membre_feffi   = currentItemCompte_feffi.id_membre_feffi ; 
          }else
          {
            vm.allcompte_feffi = vm.allcompte_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemCompte_feffi.id;
            });
          }

          vm.selectedItemCompte_feffi = {} ;
          NouvelItemCompte_feffi      = false;
          
        };

        //fonction selection item region
        vm.selectionCompte_feffi= function (item)
        {
            vm.selectedItemCompte_feffi = item;
            vm.nouvelItemCompte_feffi   = item;
            currentItemCompte_feffi    = JSON.parse(JSON.stringify(vm.selectedItemCompte_feffi)); 
        };
        $scope.$watch('vm.selectedItemCompte_feffi', function()
        {
             if (!vm.allcompte_feffi) return;
             vm.allcompte_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemCompte_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierCompte_feffi = function(item)
        {
            NouvelItemCompte_feffi = false ;
            vm.selectedItemCompte_feffi = item;
            currentItemCompte_feffi = angular.copy(vm.selectedItemCompte_feffi);
            $scope.vm.allcompte_feffi.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom_banque      = vm.selectedItemCompte_feffi.nom_banque ;
            item.adresse_banque = vm.selectedItemCompte_feffi.adresse_banque;
            item.rib  = parseInt(vm.selectedItemCompte_feffi.rib);
            item.numero_compte      =parseInt(vm.selectedItemCompte_feffi.numero_compte)  ;
            item.id_membre_feffi = vm.selectedItemCompte_feffi.membre_feffi.id; 
        };

        //fonction bouton suppression item membre
        vm.supprimerCompte_feffi = function()
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
                vm.ajoutMembre(vm.selectedItemCompte_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceCompte_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var comp = vm.allcompte_feffi.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(comp[0])
                {
                   if((comp[0].nom_banque!=currentItemCompte_feffi.nom_banque) 
                    || (comp[0].adresse_banque!=currentItemCompte_feffi.adresse_banque)
                    || (comp[0].rib!=currentItemCompte_feffi.rib)
                    || (comp[0].numero_compte!=currentItemCompte_feffi.numero_compte)
                    || (comp[0].id_membre_feffi!=currentItemCompte_feffi.id_membre_feffi))                    
                      { 
                         insert_in_baseCompte_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseCompte_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseCompte_feffi(compte_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemCompte_feffi==false)
            {
                getId = vm.selectedItemCompte_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom_banque:      compte_feffi.nom_banque,
                    adresse_banque: compte_feffi.adresse_banque,
                    rib: compte_feffi.rib,
                    numero_compte: compte_feffi.numero_compte,
                    id_membre_feffi: compte_feffi.id_membre_feffi,
                    id_feffi: vm.selectedItem.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("compte_feffi/index",datas, config).success(function (data)
            {
                var memb = vm.allmembre.filter(function(obj)
                {
                    return obj.id == compte_feffi.id_membre_feffi;
                });

                if (NouvelItemCompte_feffi == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemCompte_feffi.nom_banque        = compte_feffi.nom_banque;
                        vm.selectedItemCompte_feffi.adresse_banque       = compte_feffi.adresse_banque;
                        vm.selectedItemCompte_feffi.rib        = compte_feffi.rib;
                        vm.selectedItemCompte_feffi.numero_compte       = compte_feffi.numero_compte;
                        vm.selectedItemCompte_feffi.membre_feffi        = memb[0];
                        vm.selectedItemCompte_feffi.$selected  = false;
                        vm.selectedItemCompte_feffi.$edit      = false;
                        vm.selectedItemCompte_feffi ={};
                    }
                    else 
                    {    
                      vm.allcompte_feffi = vm.allcompte_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemCompte_feffi.id;
                      });
                    }
                }
                else
                {
                  compte_feffi.nom_banque        = compte_feffi.nom_banque;
                  compte_feffi.adresse_banque       = compte_feffi.adresse_banque;
                  compte_feffi.rib        = compte_feffi.rib;
                  compte_feffi.numero_compte       =compte_feffi.numero_compte;
                  compte_feffi.membre_feffi        = memb[0];
                  compte_feffi.id  =   String(data.response);              
                  NouvelItemCompte_feffi=false;
            }
              compte_feffi.$selected = false;
              compte_feffi.$edit = false;
              vm.selectedItemCompte_feffi = {};
            
          }).error(function (retour){
            vm.showAlert('Error','Erreur lors de l\'insertion de compte.Il se peut qu\'un compte existe déjà');});

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

        vm.affichage_occupation= function (sexe)
        { var affiche='';
          switch (sexe)
          {
            case '1':
                affiche= 'President';
                break;
            case '2':
                affiche= 'Secretaire';
                break;
            case '3':
                affiche= 'Simple membre';
                break;
            default:
          }
          return affiche;
        };
/**********************************fin membre****************************************/
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
        

    }
})();
