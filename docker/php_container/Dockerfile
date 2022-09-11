FROM php:7.4-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
\
    &&  apt-get update \
    &&  apt-get install -y --no-install-recommends \
    &&  apt-get install net-tools -y \
    &&  apt-get install iputils-ping -y \
        locales apt-utils git libicu-dev g++ libpng-dev libxml2-dev libzip-dev libonig-dev libxslt-dev unzip \
\
    &&  echo "en_US.UTF-8 UTF-8" > /etc/locale.gen  \
    &&  echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen \
    &&  locale-gen \
\
    &&  curl -sS https://getcomposer.org/installer | php -- \
    &&  mv composer.phar /usr/local/bin/composer \
\
    &&  curl -sS https://get.symfony.com/cli/installer | bash \
    &&  mv /root/.symfony5/bin/symfony /usr/local/bin \
\
    &&  docker-php-ext-configure \
            intl \
    &&  docker-php-ext-install \
            pdo pdo_mysql opcache intl zip calendar dom mbstring gd xsl \
\
    &&  pecl install apcu && docker-php-ext-enable apcu

RUN apt-get install nano
RUN apt-get install wget -y
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug
RUN apt-get update
RUN apt-get install nodejs npm -y

ADD config_php/php.ini /usr/local/etc/php/conf.d/php.ini

RUN echo  'zend_extension=xdebug' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo  '[xdebug]' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo  'xdebug.mode=develop,debug' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo  'xdebug.client_host=host.docker.internal' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo  'xdebug.start_with_request=yes' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo  'error_reporting=E_ALL' >> /usr/local/etc/php/conf.d/error_reporting.ini

WORKDIR /var/www/
