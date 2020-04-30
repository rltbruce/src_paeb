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

        vm.ajoutMembre_titulaire = ajoutMembre_titulaire ;
        var NouvelItemMembre_titulaire=false;
        var currentItemMembre_titulaire;
        vm.selectedItemMembre_titulaire = {} ;
        vm.allmembre_titulaire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

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
              vm.stepTwo = false;

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
            item.occupation   = currentItemMembre.occupation ; 
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
            if (item.$selected == false || item.$selected == undefined)
            {
                currentItemCompte_feffi    = JSON.parse(JSON.stringify(vm.selectedItemCompte_feffi));
                vm.stepTwo = true;
                apiFactory.getAPIgeneraliserREST("membre_titulaire/index",'id_compte',vm.selectedItemCompte_feffi.id).then(function(result)
                {
                    vm.allmembre_titulaire = result.data.response; 
                    console.log( vm.allmembre_titulaire);
                });
            } 
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


        /**********************************debut compte titulaire****************************************/
        vm.membre_titulaire_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterMembre_titulaire = function ()
        { 
          if (NouvelItemMembre_titulaire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              occupation:''
            };         
            vm.allmembre_titulaire.push(items);
            vm.allmembre_titulaire.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemMembre_titulaire = mem;
              }
            });

            NouvelItemMembre_titulaire = true ;
          }else
          {
            vm.showAlert('Ajout membre_titulaire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMembre_titulaire(membre_titulaire,suppression)
        {
            if (NouvelItemMembre_titulaire==false)
            {
                test_existanceMembre_titulaire (membre_titulaire,suppression); 
            } 
            else
            {
                insert_in_baseMembre_titulaire(membre_titulaire,suppression);
            }
        }

        //fonction de bouton d'annulation membre_titulaire
        vm.annulerMembre_titulaire = function(item)
        {
          if (NouvelItemMembre_titulaire == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemMembre_titulaire.nom ;
            item.prenom   = currentItemMembre_titulaire.prenom ;
            item.occupation   = currentItemMembre_titulaire.occupation ; 
          }else
          {
            vm.allmembre_titulaire = vm.allmembre_titulaire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMembre_titulaire.id;
            });
          }

          vm.selectedItemMembre_titulaire = {} ;
          NouvelItemMembre_titulaire      = false;
          
        };

        //fonction selection item region
        vm.selectionMembre_titulaire= function (item)
        {
            vm.selectedItemMembre_titulaire = item;
            vm.nouvelItemMembre_titulaire   = item;
            if(item.$selected==false)
            {
              currentItemMembre_titulaire    = JSON.parse(JSON.stringify(vm.selectedItemMembre_titulaire));
            } 
        };
        $scope.$watch('vm.selectedItemMembre_titulaire', function()
        {
             if (!vm.allmembre_titulaire) return;
             vm.allmembre_titulaire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMembre_titulaire.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierMembre_titulaire = function(item)
        {
            NouvelItemMembre_titulaire = false ;
            vm.selectedItemMembre_titulaire = item;
            currentItemMembre_titulaire = angular.copy(vm.selectedItemMembre_titulaire);
            $scope.vm.allmembre_titulaire.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.id_membre      = vm.selectedItemMembre_titulaire.membre.id ;
            item.prenom = vm.selectedItemMembre_titulaire.membre.prenom;
            item.occupation = vm.selectedItemMembre_titulaire.membre.occupation; 
        };

        //fonction bouton suppression item membre_titulaire
        vm.supprimerMembre_titulaire = function()
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
                vm.ajoutMembre_titulaire(vm.selectedItemMembre_titulaire,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceMembre_titulaire (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allmembre_titulaire.filter(function(obj)
                {
                   return obj.id == currentItemMembre_titulaire.id;
                });
                if(mem[0])
                {
                   if((mem[0].id_membre!=currentItemMembre_titulaire.id_membre))                    
                      { 
                         insert_in_baseMembre_titulaire(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMembre_titulaire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseMembre_titulaire(membre_titulaire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMembre_titulaire==false)
            {
                getId = vm.selectedItemMembre_titulaire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_compte: vm.selectedItemCompte_feffi.id,
                    id_membre: membre_titulaire.id_membre                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("membre_titulaire/index",datas, config).success(function (data)
            {   
                var membre = vm.allmembre.filter(function(obj)
                {
                    return obj.id == membre_titulaire.id_membre;
                });
                if (NouvelItemMembre_titulaire == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemMembre_titulaire.membre  = membre[0];
                        vm.selectedItemMembre_titulaire.$selected  = false;
                        vm.selectedItemMembre_titulaire.$edit      = false;
                        vm.selectedItemMembre_titulaire ={};
                        
                    }
                    else 
                    {    
                      vm.allmembre_titulaire = vm.allmembre_titulaire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMembre_titulaire.id;
                      });
                    }
                }
                else
                {
                  membre_titulaire.membre  = membre[0];
                  membre_titulaire.id  =   String(data.response);              
                  NouvelItemMembre_titulaire=false;
            }
              membre_titulaire.$selected = false;
              membre_titulaire.$edit = false;
              vm.selectedItemMembre_titulaire = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.change_membre_titulaire = function(item)
        { 
          var membre_sans0 = vm.allmembre_titulaire.filter(function(obj)
          {
              return obj.id != 0;
          });
          var membre_tit = membre_sans0.filter(function(obj)
          {
              return obj.membre.id == item.id_membre && obj.compte.id == vm.selectedItemCompte_feffi.id;
          });
          if (membre_tit.length==0)
          {
            var tousmembre = vm.allmembre.filter(function(obj)
            {
                return obj.id == item.id_membre;
            });
            console.log(tousmembre);
            item.prenom = tousmembre[0].prenom;
            item.occupation = tousmembre[0].occupation;
          }
          else
          {
            vm.showAlert('Selection refuser','Le titulaire existe déjà');
            item.id_membre = null;
          }
           
        }
          

/**********************************fin membre_titulaire****************************************/
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
