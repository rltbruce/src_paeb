(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb', [
			
            'app.paeb.ddb.localisation',
            'app.paeb.ddb.cisco',
            'app.paeb.ddb.ecole',
            //'app.paeb.ddb.plan_comptable',
            'app.paeb.ddb.prestataire',
            'app.paeb.ddb.bureau_etude',
            'app.paeb.ddb.type_batiment',
            'app.paeb.ddb.acces_zone',
            'app.paeb.ddb.zone_subvention',
            'app.paeb.ddb.type_mobilier',
            'app.paeb.ddb.type_latrine',
            'app.paeb.ddb.infrastructure'

            ])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        /*msNavigationServiceProvider.saveItem('paeb.ddb', {
            title : 'Données de Bases',
            icon  : 'icon-data',
            weight: 2,
            hidden: function()
            {
                    return vs;
            }
        });*/



    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
