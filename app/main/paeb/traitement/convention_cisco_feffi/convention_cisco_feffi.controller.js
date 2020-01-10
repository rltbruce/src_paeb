(function ()
{
    'use strict';

    angular
        .module('app.paeb.traitement.convention_cisco_feffi')
        .controller('Convention_cisco_feffiController', Convention_cisco_feffiController);
    /** @ngInject */
    function Convention_cisco_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm    = this;
        vm.ajout  = ajout ;
        var NouvelItem    = false;
        var currentItem;
        vm.selectedItem   = {} ;
        vm.allconvention  = [] ;

        vm.date_now = new Date();
        vm.allcisco   = [] ;
        vm.allouvrage = [] ;
        vm.allassotiation = [] ;        
        vm.allcategorie_ouvrage = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //col table
        vm.convention_column = [
        {
          titre:"Cisco"
        },
        {
          titre:"Feffi"
        },
        {
          titre:"Numero convention"
        },
        {
          titre:"Description"
        },        
        {
          titre:"Categorie ouvrage"
        },
        {
          titre:"Ouvrage"
        },
        {
          titre:"Montant prevu"
        },
        {
          titre:"Montant réel"
        },
        {
          titre:"Date"
        },
        {
          titre:"Action"
        }];
        
        //recuperation donnée convention
        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi/index",'menu','getconventioninvalide').then(function(result)
        {
            vm.allconvention = result.data.response; 
            console.log(vm.allconvention);
        });

        //recuperation donnée cisco
        apiFactory.getAll("cisco/index").then(function(result)
        {
          vm.allcisco= result.data.response;
        });

        //recuperation donnée feffi
        apiFactory.getAll("feffi/index").then(function(result)
        {
          vm.allfeffi= result.data.response;
        });

        //recuperation donnée ouvrage
        apiFactory.getAll("ouvrage/index").then(function(result)
        {
          vm.allouvrage= result.data.response;
        });;

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              numero_convention: '',
              description: '',
              id_cisco:'',
              id_feffi:'',
              id_categorie_ouvrage:'',
              id_ouvrage:'',              
              montant_prevu: '',
              montant_reel: '',
              date: ''
            };         
            vm.allconvention.push(items);
            vm.allconvention.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItem = conv;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(convention,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (convention,suppression); 
            } 
            else
            {
                insert_in_base(convention,suppression);
            }
        }

        //fonction de bouton d'annulation convention
        vm.annuler = function(item)
        {console.log('sdfsd');
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.numero_convention      = currentItem.numero_convention ;
            item.description       = currentItem.description ;
            item.id_cisco          = currentItem.id_cisco ;
            item.id_feffi    = currentItem.id_feffi ;
            item.id_categorie_ouvrage  = currentItem.id_categorie_ouvrage ;
            item.id_ouvrage         = currentItem.id_ouvrage ;            
            item.montant_prevu      = currentItem.montant_prevu ;
            item.montant_reel       = currentItem.montant_reel ;
            item.date       = currentItem.date ;  
          }else
          {
            vm.allconvention = vm.allconvention.filter(function(obj)
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
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.allconvention= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allconvention) return;
             vm.allconvention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allconvention.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.numero_convention = parseInt(vm.selectedItem.numero_convention) ;
            item.description       = vm.selectedItem.description ;
            item.id_cisco          = vm.selectedItem.cisco.id ;
            item.id_feffi    = vm.selectedItem.feffi.id ;
            item.id_categorie_ouvrage  = vm.selectedItem.categorie_ouvrage.id ;
            item.id_ouvrage         = vm.selectedItem.ouvrage.id ;            
            item.montant_prevu      = parseInt(vm.selectedItem.montant_prevu) ;
            item.montant_reel       = parseInt(vm.selectedItem.montant_reel) ;
            item.date       = vm.selectedItem.date ;  
        };

        //fonction bouton suppression item convention
        vm.supprimer = function()
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
                vm.ajout(vm.selectedItem,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var conv = vm.allconvention.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(conv[0])
                {
                   if((conv[0].description!=currentItem.description) 
                    || (conv[0].numero_convention!=currentItem.numero_convention)
                    || (conv[0].id_cisco!=currentItem.id_cisco)
                    || (conv[0].id_feffi!=currentItem.id_feffi)
                    || (conv[0].id_categorie_ouvrage!=currentItem.id_categorie_ouvrage)
                    || (conv[0].id_ouvrage!=currentItem.id_ouvrage)
                    || (conv[0].montant_prevu!=currentItem.montant_prevu)
                    || (conv[0].montant_reel!=currentItem.montant_reel)
                    || (conv[0].date!=currentItem.date))                    
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

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_base(convention,suppression)
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
                    numero_convention:  convention.numero_convention,
                    description:   convention.description,
                    id_cisco:      convention.id_cisco,
                    id_feffi:       convention.id_feffi,
                    id_categorie_ouvrage: convention.id_categorie_ouvrage,
                    id_ouvrage:    convention.id_ouvrage,
                    montant_reel:  convention.montant_reel,
                    montant_prevu: convention.montant_prevu,
                    date: convertionDate(new Date(convention.date)),
                    validation: 0               
                });
                //console.log(convention.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("convention/index",datas, config).success(function (data)
            {
                
                var cis = vm.allcisco.filter(function(obj)
                {
                    return obj.id == convention.id_cisco;
                });

                var asso = vm.allfeffi.filter(function(obj)
                {
                    return obj.id == convention.id_feffi;
                });

                var cat = vm.allcategorie_ouvrage.filter(function(obj)
                {
                    return obj.id == convention.id_categorie_ouvrage;
                });

                var ouv = vm.allouvrage.filter(function(obj)
                {
                    return obj.id == convention.id_ouvrage;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.numero_convention   = convention.numero_convention;
                        vm.selectedItem.description      = convention.description;
                        vm.selectedItem.cisco         = cis[0];
                        vm.selectedItem.feffi   = asso[0];
                        vm.selectedItem.categorie_ouvrage  = cat[0];
                        vm.selectedItem.ouvrage       = ouv[0];
                        vm.selectedItem.montant_prevu    = convention.montant_prevu;
                        vm.selectedItem.montant_reel     = convention.montant_reel;
                        vm.selectedItem.date     = convention.date;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allconvention = vm.allconvention.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  convention.numero_convention   = convention.numero_convention;
                  convention.description      = convention.description;
                  convention.cisco         = cis[0];
                  convention.feffi   = asso[0];
                  convention.categorie_ouvrage  = cat[0];
                  convention.ouvrage       = ouv[0];
                  convention.montant_prevu    = convention.montant_prevu;
                  convention.montant_reel     = convention.montant_reel;
                  convention.date     = convention.date;
                  convention.id  =   String(data.response);              
                  NouvelItem=false;
            }
              convention.$selected = false;
              convention.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

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
})();
