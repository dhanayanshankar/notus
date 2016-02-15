/**
 * notus v0.1.0
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 12 February, 2016
 *
 * Main Notus Script.
 */

(function() {
    "use strict";

    var self = this,
        hasRequire = (typeof require !== 'undefined'),
        old_notus = self.notus,
        _n = {},
        notus;

    var fnGetParentClassList,
        fnCreateNotusEl;

    /**
     * Local Utility API.
     */
    _n = {
        /**
         * Generate timestamp based unique ID.
         */
        genId: function() {
            return 'notus-' + Math.floor(Math.random() * 10000000000000001);
        },

        /**
         * Simple Object extender (similar to jQuery's $.extend()).
         * courtesy; SO < http://stackoverflow.com/a/11197343/414749 >
         */
        extend: function() {
            var key, i;

            for (i = 1; i < arguments.length; i++)
            {
                for (key in arguments[i])
                {
                    if (arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
                }
            }

            return arguments[0];
        },

        /**
         * String formatter.
         * Accepts first param as target string, and following params as strings to
         * replace placeholders (eg; {0}).
         * courtesy: SO <http://stackoverflow.com/a/1038930/414749>
         */
        format: function() {
            var str = arguments[0],
                reg,
                i;

            for (i = 0; i < arguments.length - 1; i++) {
                reg = new RegExp("\\{" + i + "\\}", "gm");
                str = str.replace(reg, arguments[i + 1]);
            }

            return str;
        }
    };

    /**
     * Helpers
     */
    fnGetParentClassList = function(config) {
        var classList = [],
            type = config.notusType,
            position = config.notusPosition,
            alertType = config.alertType;

        if (type === 'popup')
        {
            classList.push('notus-type-popup');

            if (position === 'top-left')
                classList.push('notus-position-tl');
            else if (position === 'top-right')
                classList.push('notus-position-tr');
            else if (position === 'bottom-left')
                classList.push('notus-position-bl');
            else
                classList.push('notus-position-br');
        }
        else
        {
            classList.push(type === 'toast' ? 'notus-type-toast' : 'notus-type-snackbar');

            if (position === 'top')
                classList.push('notus-position-t');
            else
                classList.push('notus-position-b');
        }

        switch (alertType)
        {
            case 'success':
                classList.push('notus-alert-success');
                break;
            case 'failure':
                classList.push('notus-alert-failure');
                break;
            case 'warning':
                classList.push('notus-alert-warning');
                break;
            default:
                classList.push('notus-alert-custom');
        }

        return classList;
    };

    fnCreateNotusEl = function(config) {
        var parentDiv = document.createElement('div'),
            classList,
            notusElTpl;

        classList = fnGetParentClassList(config);

        parentDiv.setAttribute('id', _n.genId());
        parentDiv.setAttribute('class', 'notus ' + classList.join(' '));

        notusElTpl = [
            '<div class="notus-body-item notus-text">',
                '{0}',
            '</div>',
            '<div class="notus-body-item notus-close">',
                '<span class="icon-close">&times;</span>',
            '</div>'
        ].join('');

        parentDiv.innerHTML = _n.format(notusElTpl, config.message);

        return parentDiv;
    };

    notus = self.notus = function(userConfig) {
        var bodyEL = document.body,
            defaultConfig = {},
            thisNotus = {};

        /** Default Config options that Notus provides **/
        defaultConfig = {
            notusType: 'popup',                     /* Type can be anything from; 'popup', 'toast' or 'snackbar' */

            notusPosition: 'left',                  /* Available positions for different notus types;
                                                       'popup'              => 'top-left', 'bottom-left', 'top-right' or 'bottom-right'
                                                       'toast' & 'snackbar' => 'top' or 'bottom' */

            alertType: 'success',                   /* Alert type can be; 'success', 'failure' or 'warning' */

            closable: true,                         /* Show close button to close Notus */

            autoClose: true,                        /* Automatically close Notus once autoCloseDuration completes */

            autoCloseDuration: 3000,                /* Milliseconds to wait before closing  */

            animate: true                           /* Animate while showing/hiding Notus */
        };

        userConfig = _n.extend(defaultConfig, userConfig);

        /** Notus API begin **/

        /**
         * Resolve instance conflict in case module is loaded more than once.
         */
        thisNotus.noConflict = function() {
            self.notus = old_notus;
            return notus;
        };


        thisNotus.send = function(config) {
            var notusEl;

            config = _n.extend(userConfig, config);

            notusEl = fnCreateNotusEl(config);

            bodyEL.appendChild(notusEl);

            return notusEl.getAttribute('id');
        };
        /** Notus API end **/

        return thisNotus;
    };

    // UMD Definition < https://github.com/umdjs/umd >.
    if (typeof exports !== 'undefined')
    {
        if (typeof module !== 'undefined' &&
            module.exports)
        {
            exports = module.exports = notus;
        }
        exports.notus = notus;
    }
    else
    {
        self.notus = notus;
    }
}).call(this);
