(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataires.partenaire_relai')
        .controller('Partenaire_relaiController', Partenaire_relaiController);
    /** @ngInject */
    function Partenaire_relaiController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allpartenaire_relai = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.partenaire_relai_column = [{titre:"Nom"},{titre:"Nif"},{titre:"Stat"},{titre:"Siege"},{titre:"telephone"},{titre:"Action"}];
        
        //recuperation donnée partenaire_relai
        apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai = result.data.response; 
            //console.log(vm.allpartenaire_relai);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              nom: '',         
              nif: '',
              stat: '',         
              siege: '',
              telephone: ''
            };         
            vm.allpartenaire_relai.push(items);
            vm.allpartenaire_relai.forEach(function(pres)
            {
              if(pres.$selected==true)
              {
                vm.selectedItem = pres;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout partenaire_relai','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(partenaire_relai,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (partenaire_relai,suppression); 
            } 
            else
            {
                insert_in_base(partenaire_relai,suppression);
            }
        }

        //fonction de bouton d'annulation partenaire_relai
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.telephone = currentItem.telephone ;
            item.nom  = currentItem.nom  ;
            item.nif  = currentItem.nif ; 
            item.stat = currentItem.stat ; 
            item.siege= currentItem.siege ;  
          }else
          {
            vm.allpartenaire_relai = vm.allpartenaire_relai.filter(function(obj)
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
            if(item.$selected == false)
            {
              currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
            }
            
           // vm.allpartenaire_relai= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allpartenaire_relai) return;
             vm.allpartenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item partenaire_relai
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allpartenaire_relai.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.telephone      = vm.selectedItem.telephone ;
            item.nom       = vm.selectedItem.nom;
            item.nif       = vm.selectedItem.nif ;
            item.stat      = vm.selectedItem.stat ;
            item.siege     = vm.selectedItem.siege ; 
        };

        //fonction bouton suppression item partenaire_relai
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enpartenaire_relaiistrement ?')
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

        //function teste s'il existe une modification item partenaire_relai
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allpartenaire_relai.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].nom!=currentItem.nom) 
                    || (cis[0].telephone!=currentItem.telephone)
                    || (cis[0].nif!=currentItem.nif)
                    || (cis[0].stat!=currentItem.stat)
                    || (cis[0].siege!=currentItem.siege))                    
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

        //insertion ou mise a jours ou suppression item dans bdd partenaire_relai
        function insert_in_base(partenaire_relai,suppression)
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
                    id:     getId,      
                    telephone:   partenaire_relai.telephone,
                    nom:    partenaire_relai.nom,      
                    nif:    partenaire_relai.nif,      
                    stat:   partenaire_relai.stat,      
                    siege:  partenaire_relai.siege,               
                });
                //console.log(partenaire_relai.pays_id);
                //factory
            apiFactory.add("partenaire_relai/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.nom        = partenaire_relai.nom;
                        vm.selectedItem.telephone       = partenaire_relai.telephone;
                        vm.selectedItem.nif       = partenaire_relai.nif;
                        vm.selectedItem.stat       = partenaire_relai.stat;
                        vm.selectedItem.siege       = partenaire_relai.siege;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allpartenaire_relai = vm.allpartenaire_relai.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  partenaire_relai.nom =  partenaire_relai.nom;
                  partenaire_relai.telephone=  partenaire_relai.telephone;
                  partenaire_relai.nif =  partenaire_relai.nif;
                  partenaire_relai.stat=  partenaire_relai.stat;
                  partenaire_relai.siege =  partenaire_relai.siege;
                  partenaire_relai.id  =   String(data.response);              
                  NouvelItem=false;
            }
              partenaire_relai.$selected = false;
              partenaire_relai.$edit = false;
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
})();
