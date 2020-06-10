(function ()
{
    'use strict';

    angular
        .module('app.paeb.note_agence_acc')
        .controller('Note_agence_accController', Note_agence_accController);
    /** @ngInject */
    function Note_agence_accController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allagence_acc =[];
        vm.allnote_agence_acc =[];
        vm.allannee =[];
        vm.showfiltre = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false         
        };

        vm.datenow     = new Date();
        vm.annee        = vm.datenow.getFullYear();

        for (var annee = 2019; annee <= vm.annee; annee++) {
        vm.allannee.push(annee);
        }
        //col table
        vm.note_agence_acc_column = [
        {titre:"Année"
        },
        {titre:"Agence d'accompagnemant"
        },
        {titre:"Note"
        },
        {titre:"Observation"
        },
        {titre:"Action"}];

        apiFactory.getAll("agence_acc/index").then(function(result)
        {
          vm.allagence_acc= result.data.response;
          console.log(vm.allecole);
        });

         
        vm.recherchefiltre = function(filtre)
        {console.log(filtre);
          apiFactory.getAPIgeneraliserREST("note_agence_acc/index","menu","getnote_agence_accByfiltre","annee",parseInt(filtre.annee),"id_agence_acc",filtre.id_agence_acc).then(function(result)
          {
            vm.allnote_agence_acc= result.data.response;
            console.log(vm.allnote_agence_acc);
          });
        }

        vm.afficherfiltre = function()
        {

        vm.showfiltre = true;

        }
        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          vm.vm.showfiltre = false;
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_agence_acc: '',
              note: 0,
              annee:'',        
              observation: ''
            };         
            vm.allnote_agence_acc.push(items);
            vm.allnote_agence_acc.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout note_agence_acc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(note_agence_acc,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (note_agence_acc,suppression); 
            } 
            else
            {
                insert_in_base(note_agence_acc,suppression);
            }
        }

        //fonction de bouton d'annulation note_agence_acc
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.annee      = currentItem.annee ;
            item.note    = currentItem.note ;
            item.observation    = currentItem.observation ;
            item.id_agence_acc   = currentItem.id_agence_acc ;
          }else
          {
            vm.allnote_agence_acc = vm.allnote_agence_acc.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          vm.showfiltre = false;
          
        };

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.allnote_agence_acc= [] ;
           //console.log(item); 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allnote_agence_acc) return;
             vm.allnote_agence_acc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item note_agence_acc
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allnote_agence_acc.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.annee      = vm.selectedItem.annee ;
            item.note      = vm.selectedItem.note ;
            item.observation      = vm.selectedItem.observation ;
            item.id_agence_acc = vm.selectedItem.agence_acc.id;

            vm.vm.showfiltre = false;
           
        };

        //fonction bouton suppression item note_agence_acc
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet ennote_agence_accistrement ?')
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

        //function teste s'il existe une modification item note_agence_acc
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allnote_agence_acc.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].annee!=currentItem.annee)
                    || (cis[0].observation!=currentItem.observation)
                    || (cis[0].id_agence_acc!=currentItem.id_agence_acc)
                    || (cis[0].note!=currentItem.note))                    
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

        //insertion ou mise a jours ou suppression item dans bdd note_agence_acc
        function insert_in_base(note_agence_acc,suppression)
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
                    annee:      note_agence_acc.annee,     
                    note:    note_agence_acc.note,      
                    observation:    note_agence_acc.observation,
                    id_agence_acc:   note_agence_acc.id_agence_acc,
                    validation:   0                 
                });
                console.log(datas);
                //factory
            apiFactory.add("note_agence_acc/index",datas, config).success(function (data)
            {              
                var agen = vm.allagence_acc.filter(function(obj)
                {
                    return obj.id == note_agence_acc.id_agence_acc;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.agence_acc   = agen[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allnote_agence_acc = vm.allnote_agence_acc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                { 
                  note_agence_acc.validation = 0;
                  note_agence_acc.agence_acc   = agen[0];
                  note_agence_acc.id        =   String(data.response);              
                  NouvelItem = false;
            }
              note_agence_acc.$selected = false;
              note_agence_acc.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        
      }
        vm.validernote_agence_acc = function()
        {
          maj_insertion_inbase(vm.selectedItem,0,1);
        }

        function maj_insertion_inbase(note_agence_acc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        note_agence_acc.id,      
                    annee:      note_agence_acc.annee,     
                    note:    note_agence_acc.note,      
                    observation:    note_agence_acc.observation,
                    id_agence_acc:   note_agence_acc.id_agence_acc,
                    validation:   1                 
                });
                console.log(datas);
                //factory
            apiFactory.add("note_agence_acc/index",datas, config).success(function (data)
            {              
              note_agence_acc.validation = 1;
              note_agence_acc.$selected = false;
              note_agence_acc.$edit = false;
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
    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
