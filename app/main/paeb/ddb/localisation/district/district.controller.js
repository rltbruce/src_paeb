(function ()
{
     'use strict';

    angular
        .module('app.paeb.ddb.localisation.district')
        .controller('DistrictController', DistrictController);

    /** @ngInject */
    function DistrictController($mdDialog, $scope, apiFactory, $state)
    {
      var vm         = this;
      vm.ajout       = ajout ;
      var NouvelItem = false;
      var currentItem;
      vm.titrepage    ="Ajout district";
      vm.selectedItem = {} ;
      vm.alldistrict  = [] ;

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau = 1 ;

      //variable cache masque de saisie
      vm.affichageMasque = 0 ;

      //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };

    //col table
    vm.district_column = [
      {
        titre:"Code"
      },
      {
        titre:"Nom"
      },
      {
        titre:"Region"
      }
    ];

    apiFactory.getAll("region/index").then(function(result)
    {
        vm.allregion= result.data.response;
    });

    apiFactory.getAll("district/index").then(function(result)
    {
        vm.alldistrict = result.data.response;
    });


    function ajout(district,suppression)   
    {
      if (NouvelItem==false) 
      {
          test_existance (district,suppression); 
      }
      else
      {
          insert_in_base(district,suppression);
      }
                
    }

    function insert_in_base(district,suppression)
    { //add
      var config =
      {
          headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
      };

      var getId = 0;
      if (NouvelItem==false) 
      {
          getId = vm.selectedItem.id; 
      } 
      
      var datas = $.param(
      {
          supprimer: suppression,
          id:        getId,      
          code:      district.code,
          nom:       district.nom,
          region_id: district.region_id                
      });
        
      //factory
      apiFactory.add("district/index",datas, config).success(function (data)
      {
        var reg = vm.allregion.filter(function(obj)
        {
            return obj.id == vm.district.region_id;
        });
        if (NouvelItem == false) 
        {
            // Update or delete: id exclu
            if(suppression==0) 
            {
                vm.selectedItem.nom        = vm.district.nom;
                vm.selectedItem.code       = vm.district.code;
                vm.selectedItem.region     = reg[0];
                vm.afficherboutonModifSupr = 0 ;
                vm.afficherboutonModif     = 0 ;
                vm.afficherboutonnouveau   = 1 ;
                vm.selectedItem.$selected  = false;
                vm.selectedItem            = {};
            } 
            else 
            {    
                vm.alldistrict = vm.alldistrict.filter(function(obj)
                {
                  return obj.id !== currentItem.id;
                });
            }
        }
        else
        {
            var item = {
                        nom:    district.nom,
                        code:   district.code,
                        id:     String(data.response) ,
                        region: reg[0]
                      };
                    
            vm.alldistrict.push(item);
            vm.district = {};
            NouvelItem  = false;
        }

        vm.affichageMasque = 0 ;

      }).error(function (data) {alert('Error');});
                
    }
//selection sur la liste
    vm.selection= function (item)
    { 
        vm.selectedItem = item;
        vm.nouvelItem   = item;
        currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
        vm.afficherboutonModifSupr = 1 ;
        vm.afficherboutonModif     = 1 ;
        vm.affichageMasque         = 0 ;
        vm.afficherboutonnouveau   = 1 ;
    };

    $scope.$watch('vm.selectedItem', function()
    {
        if (!vm.alldistrict) return;
        vm.alldistrict.forEach(function(item)
        {
          item.$selected = false;
        });
        vm.selectedItem.$selected = true;
    });

      //function cache masque de saisie
    vm.ajouter = function () 
    {
        vm.titrepage="Ajout district";
        vm.selectedItem.$selected  = false;
        vm.affichageMasque         = 1 ;
        vm.district                = {};
        NouvelItem                 = true ;
        vm.afficherboutonModifSupr = 0;
        vm.afficherboutonModif     = 0;
        vm.afficherboutonnouveau   = 1;

    };

    vm.annuler = function() 
    {
        vm.selectedItem            = {} ;
        vm.selectedItem.$selected  = false;
        vm.affichageMasque         = 0 ;
        vm.afficherboutonnouveau   = 1 ;
        vm.afficherboutonModifSupr = 0 ;
        vm.afficherboutonModif     = 0 ;
        NouvelItem                 = false;

    };

    vm.modifier = function() 
    {
        vm.titrepage               = "Modifier district";
        NouvelItem                 = false ;
        vm.affichageMasque         = 1 ;
        vm.district.id             = vm.selectedItem.id ;
        vm.district.code           = vm.selectedItem.code ;
        vm.district.nom            = vm.selectedItem.nom ;
        vm.district.region_id      = vm.selectedItem.region.id;          
        vm.afficherboutonModifSupr = 0;
        vm.afficherboutonModif     = 1;
        vm.afficherboutonnouveau   = 0;  

    };

    vm.supprimer = function() 
    {
        vm.affichageMasque         = 0 ;
        vm.afficherboutonModifSupr = 0 ;
        vm.afficherboutonModif     = 0 ;
        var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

        $mdDialog.show(confirm).then(function()
        {
            vm.ajout(vm.selectedItem,1);
        }, function() {
            //alert('rien');
          });
    };
        
    function test_existance (item,suppression) 
      {
          if (suppression!=1) 
          {
              var dist = vm.alldistrict.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(dist[0])
                {
                   if((dist[0].nom!=item.nom)
                        ||(dist[0].code!=item.code)
                        ||(dist[0].region.id!=item.region_id))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
          }
            else
              insert_in_base(item,suppression);
      }
  }

})();
